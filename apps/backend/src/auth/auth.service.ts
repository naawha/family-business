import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'
import type {
  LoginBodyType,
  LoginResponseType,
  RegisterBodyType,
  RegisterResponseType,
} from '@family-business/types/modules/accounts'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...rest } = user
      return rest
    }
    return null
  }

  async login(body: LoginBodyType): Promise<LoginResponseType> {
    const user = await this.validateUser(body.email, body.password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload = { email: user.email, sub: user.id }
    return {
      user,
      token: this.jwtService.sign(payload),
    }
  }

  async register(body: RegisterBodyType): Promise<RegisterResponseType> {
    const existing = await this.usersService.findByEmail(body.email)
    if (existing) {
      throw new ConflictException('Email already taken')
    }
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const user = await this.usersService.create({
      ...body,
      password: hashedPassword,
    })
    const { password: _, ...userWithoutPassword } = user
    const payload = { email: user.email, sub: user.id }
    return {
      user: userWithoutPassword,
      token: this.jwtService.sign(payload),
    }
  }
}
