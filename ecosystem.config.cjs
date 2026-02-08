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
      name: 'family-business-web',
      cwd: './apps/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
}
