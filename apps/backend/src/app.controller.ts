import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }

  @Get()
  root() {
    return {
      message: 'Family Business API',
      version: '0.1.0',
      docs: '/api/api-docs',
    }
  }
}
