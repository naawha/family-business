# Web Application - Family Business

Веб-приложение для управления семейными задачами, списками покупок и запланированными покупками.

## 🏗️ Архитектура

Проект использует **Feature-Sliced Design (FSD)** - современную архитектурную методологию для фронтенд приложений.

```
src/
├── app/          # Инициализация (провайдеры, store)
├── pages/        # Next.js pages (роутинг)
├── widgets/      # Крупные композитные блоки UI
├── features/     # Фичи (действия пользователя)
├── entities/     # Бизнес-сущности (API, state)
└── shared/       # Переиспользуемый код
```

📖 Подробнее: [FSD_ARCHITECTURE.md](./FSD_ARCHITECTURE.md)

## 🛠️ Технологии

- **Framework**: [Next.js 14](https://nextjs.org/) (Pages Router)
- **UI**: [Mantine](https://mantine.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Architecture**: [Feature-Sliced Design](https://feature-sliced.design/)

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- pnpm 8+

### Установка

```bash
# Из корня монорепозитория
pnpm install
```

### Разработка

```bash
# Запуск dev сервера (порт 3001)
pnpm web:dev

# Или из директории apps/web
cd apps/web
pnpm dev
```

Приложение будет доступно на http://localhost:3001

### Сборка

```bash
pnpm web:build
```

## 📂 Структура проекта

### App Layer

Инициализация приложения, провайдеры, конфигурация store.

```
app/
├── providers/
│   ├── StoreProvider.tsx    # Redux Provider
│   ├── ThemeProvider.tsx    # Mantine Provider
│   └── index.tsx            # Композиция
└── store.ts                 # Redux Store
```

### Entities Layer

Бизнес-сущности с API и состоянием.

```
entities/
├── user/                    # Авторизация
│   ├── api/authApi.ts      # Login, Register
│   └── model/authSlice.ts  # User state
└── todo/                    # Задачи
    └── api/todoApi.ts      # CRUD операции
```

### Features Layer

Фичи - действия пользователя.

```
features/
├── auth/
│   ├── ui/LoginForm.tsx
│   └── ui/RegisterForm.tsx
└── todo-create/
    └── ui/CreateTodoModal.tsx
```

### Widgets Layer

Крупные композитные блоки UI.

```
widgets/
├── dashboard-layout/
│   └── ui/DashboardLayout.tsx
└── todo-list/
    └── ui/TodoList.tsx
```

### Shared Layer

Переиспользуемый код.

```
shared/
├── api/         # RTK Query base
├── config/      # Конфигурация
├── ui/          # UI компоненты
└── lib/         # Утилиты
```

## 🎯 Основные страницы

- `/` - Главная страница (лендинг)
- `/login` - Вход
- `/register` - Регистрация
- `/dashboard` - Панель управления
- `/dashboard/todos` - Задачи
- `/dashboard/shopping` - Покупки
- `/dashboard/planned` - Запланированные покупки

## 🔌 API Integration

Приложение взаимодействует с NestJS backend через RTK Query:

```typescript
// Базовая конфигурация
shared / api / base.ts;

// Entity API
entities / user / api / authApi.ts;
entities / todo / api / todoApi.ts;
```

Backend URL настраивается через переменные окружения:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## 📝 Соглашения

### Public API

Каждый модуль экспортирует только то, что нужно другим через `index.ts`:

```typescript
// entities/user/index.ts
export { useLoginMutation, useRegisterMutation } from './api/authApi';
export { setCredentials, logout } from './model/authSlice';
```

### Импорты

```typescript
// ✅ Правильно (через Public API)
import { useLoginMutation } from '@/entities/user';
import { DashboardLayout } from '@/ensembles/dashboard-layout';

// ❌ Неправильно (прямой доступ к внутренностям)
import { authApi } from '@/entities/user/api/authApi';
```

### Правила зависимостей

- `shared` → не зависит ни от чего
- `entities` → может использовать `shared`
- `features` → может использовать `shared`, `entities`
- `widgets` → может использовать `shared`, `entities`, `features`
- `pages` → может использовать все слои

## 🧪 Тестирование

```bash
# Unit тесты
pnpm test

# E2E тесты
pnpm test:e2e

# Проверка типов
pnpm type-check
```

## 📚 Документация

- [FSD Architecture](./FSD_ARCHITECTURE.md) - подробное описание архитектуры
- [Visual Structure](./FSD_VISUAL_STRUCTURE.md) - визуальная структура
- [Migration Guide](./FSD_MIGRATION_COMPLETE.md) - как была проведена миграция
- [Checklist](./FSD_CHECKLIST.md) - чеклист задач

## 🤝 Contributing

При добавлении новых фич следуйте FSD архитектуре:

1. Определите в какой слой относится ваш код
2. Создайте модуль с правильной структурой
3. Экспортируйте только Public API через index.ts
4. Следуйте правилам зависимостей между слоями

## 📄 License

MIT
