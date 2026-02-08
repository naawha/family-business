import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { FamiliesModule } from '../families/families.module'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { InvitesService } from './invites.service'

@Module({
  imports: [AuthModule, UsersModule, FamiliesModule],
  controllers: [AccountsController],
  providers: [AccountsService, InvitesService],
  exports: [AccountsService],
})
export class AccountsModule {}
