# Деплой Family Business (без Docker)

Пошаговая инструкция для запуска приложения на облачном сервере (VPS: DigitalOcean, Timeweb, Selectel, AWS EC2 и т.п.) без Docker.

---

## 1. Подготовка сервера

- **ОС:** Ubuntu 22.04 (или другой Linux с Node.js 18+).
- Установите:
  - **Node.js 18+** (рекомендуется через [nvm](https://github.com/nvm-sh/nvm) или официальный репозиторий).
  - **pnpm 8+:** `npm install -g pnpm`
  - **PM2 (глобально):** `npm install -g pm2` — для запуска и автоперезапуска процессов.

---

## 2. Клонирование и установка зависимостей

```bash
git clone <URL-вашего-репозитория> family-business
cd family-business
pnpm install
```

---

## 3. Переменные окружения

### Backend (`apps/backend/.env`)

Создайте файл `apps/backend/.env`:

```env
DATABASE_URL="file:./prisma/data/prod.db"
JWT_SECRET="<длинный-случайный-секрет-для-production>"
PORT=3000
NODE_ENV=production
```

- `JWT_SECRET` — придумайте длинную случайную строку (например, `openssl rand -hex 32`).
- Для SQLite путь `file:./prisma/data/prod.db` относителен к `apps/backend`; папку `prisma/data` создайте при необходимости: `mkdir -p apps/backend/prisma/data`.

### Frontend (переменные при сборке)

Перед сборкой фронтенда задайте переменные, чтобы в браузер попали правильные URL API и WebSocket (ваш домен или IP сервера):

```bash
export NEXT_PUBLIC_API_URL=https://ваш-домен-или-ip
export NEXT_PUBLIC_WS_URL=wss://ваш-домен-или-ip
```

Либо создайте `apps/frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://ваш-домен-или-ip
NEXT_PUBLIC_WS_URL=wss://ваш-домен-или-ip
```

Если API и фронт на одном домене за одним веб-сервером (nginx), можно использовать относительные URL или тот же хост.

**SSR: внутренний URL бэкенда.** При рендере на сервере Next.js ходит в API по внутреннему адресу (без выхода в сеть), что быстрее. Задайте на сервере **только для процесса фронта** (в `.env.production` или в PM2 `env`):

```env
API_INTERNAL_URL=http://127.0.0.1:3000
```

В браузере по-прежнему используется `NEXT_PUBLIC_API_URL`. Если `API_INTERNAL_URL` не задан, при SSR используется `NEXT_PUBLIC_API_URL`.

---

## 4. Сборка проекта

Из **корня** репозитория:

```bash
pnpm build
```

Собираются backend (NestJS) и frontend (Next.js). После сборки:
- backend: `apps/backend/dist/`
- frontend: `apps/frontend/.next/`

---

## 5. Миграции базы данных

Один раз перед первым запуском (из корня или из `apps/backend`):

```bash
cd apps/backend
npx prisma migrate deploy
cd ../..
```

Убедитесь, что `DATABASE_URL` в `apps/backend/.env` указывает на нужный файл БД (например, `prod.db` в `prisma/data/`).

---

## 6. Запуск через PM2

Из **корня** репозитория:

```bash
pm2 start ecosystem.config.cjs
```

Так запустятся:
- **Backend:** порт 3000 (`apps/backend` → `node dist/main.js`).
- **Frontend:** порт 3001 (`apps/frontend` → `next start -p 3001`).

Полезные команды PM2:

```bash
pm2 status              # статус процессов
pm2 logs                # логи
pm2 restart all         # перезапуск
pm2 save                # сохранить список процессов
pm2 startup             # автозапуск при перезагрузке сервера (выполнить один раз)
```

---

## 7. Как проект должен запускаться

1. **Сервер включён** → при настройке `pm2 startup` PM2 сам поднимает приложения.
2. **Вручную:** из корня репозитория выполнить `pm2 start ecosystem.config.cjs`.
3. **После деплоя (git pull + пересборка):**
   ```bash
   pnpm install
   pnpm build
   cd apps/backend && npx prisma migrate deploy && cd ../..
   pm2 restart all
   ```

Backend слушает порт 3000, frontend — 3001. Пользователи заходят на фронт (например, `http://ваш-сервер:3001` или домен, который вы направите на 3001).

---

## 8. Веб-сервер (nginx) и HTTPS (рекомендуется)

Все запросы к API идут с префиксом `/api`. В nginx на одном домене: `/api` и `/socket.io` — на бэкенд (порт 3000), остальное — на фронт (порт 3001).

Пример одного сервера на домене (замените `your-domain.com` и пути к сертификатам):

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # API и Swagger — на бэкенд (3000)
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket (Socket.io) — на бэкенд (3000)
    location /socket.io {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Всё остальное — на фронт (3001)
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

В `NEXT_PUBLIC_API_URL` укажите `https://your-domain.com` (без `/api` — префикс добавляется в коде). В `NEXT_PUBLIC_WS_URL` — `wss://your-domain.com`. Swagger: `https://your-domain.com/api/api-docs`.

---

## Краткий чеклист деплоя

1. Установить Node.js 18+, pnpm, PM2 на сервере.
2. Клонировать репозиторий, выполнить `pnpm install`.
3. Создать `apps/backend/.env` (DATABASE_URL, JWT_SECRET, PORT, NODE_ENV).
4. Создать `apps/frontend/.env.production` с NEXT_PUBLIC_API_URL и NEXT_PUBLIC_WS_URL (или экспортировать их перед сборкой).
5. Выполнить `pnpm build`.
6. Выполнить миграции: `cd apps/backend && npx prisma migrate deploy`.
7. Запустить: `pm2 start ecosystem.config.cjs`, затем `pm2 save` и `pm2 startup`.
8. При необходимости настроить nginx и HTTPS.

После этого приложение работает без Docker: backend на 3000, frontend на 3001, управление — через PM2.
