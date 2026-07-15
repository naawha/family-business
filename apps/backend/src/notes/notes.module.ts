import { Module } from '@nestjs/common'
import { FamiliesModule } from '../families/families.module'
import { NotesService } from './notes.service'
import { NotesController } from './notes.controller'

@Module({
  imports: [FamiliesModule],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
