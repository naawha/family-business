import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })

  const logger = new Logger('HTTP')

  // Все маршруты под /api (для nginx: proxy /api -> 3000, остальное -> 3001)
  app.setGlobalPrefix('api')

  // Enable CORS for frontend
  app.enableCors({
    origin: true, // Разрешаем все origin для разработки (в production нужно указать конкретные)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // HTTP request logging middleware
  app.use((req, res, next) => {
    const { method, originalUrl } = req
    const startTime = Date.now()

    res.on('finish', () => {
      const { statusCode } = res
      const duration = Date.now() - startTime
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`

      if (statusCode >= 500) {
        logger.error(message)
      } else if (statusCode >= 400) {
        logger.warn(message)
      } else {
        logger.log(message)
      }
    })

    next()
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Family Business API')
    .setDescription('API for managing family tasks, shopping, and planned purchases')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/api-docs', app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)

  console.log(`🚀 Server running on http://localhost:${port}`)
  console.log(`📚 API docs available at http://localhost:${port}/api/api-docs`)
}

bootstrap()
