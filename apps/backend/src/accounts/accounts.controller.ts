import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard'
import { AccountsService } from './accounts.service'
import type {
  RegisterBodyType,
  LoginBodyType,
  UpdateMeBodyType,
  FamiliesCreateBodyType,
  FamiliesUpdateBodyType,
  FamiliesInviteMemberBodyType,
  FamiliesCreateQrInviteBodyType,
  InvitesAcceptBodyType,
} from '@family-business/types/modules/accounts'

interface JwtUser {
  userId: string
  email: string
}

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private accounts: AccountsService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register' })
  async register(@Body() body: RegisterBodyType) {
    return this.accounts.register(body)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  async login(@Body() body: LoginBodyType) {
    return this.accounts.login(body)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current user' })
  async getMe(@Request() req: { user: JwtUser }) {
    return this.accounts.getMe(req.user.userId)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  async updateMe(@Request() req: { user: JwtUser }, @Body() body: UpdateMeBodyType) {
    return this.accounts.updateMe(req.user.userId, body)
  }

  @Get('me/families')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List families' })
  async familiesList(@Request() req: { user: JwtUser }) {
    return this.accounts.familiesList(req.user.userId)
  }

  @Get('me/invites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending invites for current user' })
  async invitesList(@Request() req: { user: JwtUser }) {
    return this.accounts.invitesList(req.user.userId)
  }

  @Get('me/families/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get family by id' })
  async familiesGetById(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    return this.accounts.familiesGetById(req.user.userId, id)
  }

  @Post('me/families')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create family' })
  async familiesCreate(@Request() req: { user: JwtUser }, @Body() body: FamiliesCreateBodyType) {
    return this.accounts.familiesCreate(req.user.userId, body)
  }

  @Patch('me/families/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update family' })
  async familiesUpdate(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() body: FamiliesUpdateBodyType,
  ) {
    return this.accounts.familiesUpdate(req.user.userId, id, body)
  }

  @Post('me/families/:id/invites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Invite by email' })
  async familiesInviteMember(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() body: FamiliesInviteMemberBodyType,
  ) {
    return this.accounts.familiesInviteMember(req.user.userId, id, body)
  }

  @Post('me/families/:id/invites/qr')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create QR invite' })
  async familiesCreateQrInvite(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() body?: FamiliesCreateQrInviteBodyType,
  ) {
    return this.accounts.familiesCreateQrInvite(req.user.userId, id, body)
  }

  @Delete('me/families/:id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove member' })
  async familiesRemoveMember(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    await this.accounts.familiesRemoveMember(req.user.userId, id, memberId)
  }

  @Get('invites/:token')
  @ApiOperation({ summary: 'Get invite info by token (public)' })
  async invitesGetByToken(@Param('token') token: string) {
    return this.accounts.invitesGetByToken(token)
  }

  @Post('invites/:token/accept')
  @ApiOperation({ summary: 'Accept invite (JWT optional)' })
  @UseGuards(OptionalJwtGuard)
  async invitesAccept(
    @Param('token') token: string,
    @Request() req: { user: JwtUser | null },
    @Body() body?: InvitesAcceptBodyType,
  ) {
    const userId = req.user?.userId ?? null
    return this.accounts.invitesAccept(token, userId, body)
  }
}
