import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateToken(payload: {
    sub: string;
    role?: Role;
  }): Promise<{ access_token: string; refresh_token: string }> {
    const authToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXP_D,
    });
    return {
      access_token: authToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateUserCredentials(dto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid =
      (await bcrypt.compare(dto.password, user.password)) ||
      dto.password === user.password; // fallback for seeded users
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signup(dto: LoginDto) {
    const isEmailTaken = await this.userService.findByEmail(dto.email);
    if (isEmailTaken) {
      throw new ConflictException('Email already taken');
    }
    this.sendConfirmationEmail(dto.email);
    const user = await this.userService.createUser(dto.email, dto.password);
    const payload = { sub: user.id, role: user.role };
    return await this.generateToken(payload);
  }

  async login(dto: LoginDto) {
    const user = await this.validateUserCredentials(dto);
    const payload = { sub: user.id, role: user.role };
    return await this.generateToken(payload);
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      const newPayload = { sub: user.id, role: user.role };
      return await this.generateToken(newPayload);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async sendConfirmationEmail(email: string) {
    // mock send email
    const host = process.env.HOST;
    const token = await this.jwtService.signAsync({ email });
    const verificationLink = `http://${host}/auth/verify-email?token=${token}`;
    console.log(verificationLink);
  }

  async verifyEmailToken(token: string) {
    try {
      const { email } = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findByEmail(email);
      return `Email has been confirmed for user ${user.id}`;
    } catch (error) {
      throw new ConflictException('Email was not confirmed');
    }
  }
}
