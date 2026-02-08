import { Module } from '@nestjs/common'
import { FamiliesModule } from '../families/families.module'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'

@Module({
  imports: [FamiliesModule],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodosModule {}
