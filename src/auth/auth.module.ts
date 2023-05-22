import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';

const jwtFactory = {
  PassportModule,
  useFactory: () => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXP_H,
    },
  }),
};

@Module({
  imports: [JwtModule.registerAsync(jwtFactory)],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, JwtStrategy, UserService],
  exports: [AuthService, JwtStrategy, JwtModule, UserService],
})
export class AuthModule {}
