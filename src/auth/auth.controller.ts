import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('signup')
  async signup(@Body() payload: LoginDto) {
    return this.authService.signup(payload);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token in Authorization header' })
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verification link from email' })
  @ApiResponse({
    status: 200,
    description: 'Returns success or failure message',
  })
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    const verified = await this.authService.verifyEmailToken(token);

    if (!verified) {
      throw new BadRequestException('Invalid token');
    }

    return {
      message: 'Email has been confirmed',
    };
  }
}
