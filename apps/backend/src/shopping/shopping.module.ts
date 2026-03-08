import { Module } from '@nestjs/common'
import { FamiliesModule } from '../families/families.module'
import { WebsocketModule } from '../websocket/websocket.module'
import { ShoppingService } from './shopping.service'
import { ShoppingController } from './shopping.controller'

@Module({
  imports: [FamiliesModule, WebsocketModule],
  providers: [ShoppingService],
  controllers: [ShoppingController],
})
export class ShoppingModule {}
