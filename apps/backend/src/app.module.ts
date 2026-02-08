import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { FamiliesModule } from './families/families.module'
import { AccountsModule } from './accounts/accounts.module'
import { TodosModule } from './todos/todos.module'
import { ShoppingModule } from './shopping/shopping.module'
import { RecurringModule } from './recurring/recurring.module'
import { WebsocketModule } from './websocket/websocket.module'
import { RecipesModule } from './recipes/recipes.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    FamiliesModule,
    AccountsModule,
    TodosModule,
    ShoppingModule,
    RecurringModule,
    WebsocketModule,
    RecipesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
