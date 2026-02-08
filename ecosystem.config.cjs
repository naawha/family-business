/**
 * Конфиг pm2 для деплоя без Docker.
 * Использование: из корня репозитория — pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'family-business-backend',
      cwd: './apps/backend',
      script: 'node',
      args: 'dist/main.js',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: 'family-business-frontend',
      cwd: './apps/frontend',
      script: 'pnpm',
      args: 'run start',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
}
