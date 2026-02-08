import { Module } from '@nestjs/common'
import { RecipesService } from './recipes.service'
import { RecipesController } from './recipes.controller'
import { FamiliesModule } from '../families/families.module'

@Module({
  imports: [FamiliesModule],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
