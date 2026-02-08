import { Module } from '@nestjs/common'
import { ShoppingService } from './shopping.service'
import { ShoppingController } from './shopping.controller'
import { FamiliesService } from 'src/families/families.service'

@Module({
  providers: [ShoppingService, FamiliesService],
  controllers: [ShoppingController],
})
export class ShoppingModule {}
