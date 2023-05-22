import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver, JwtStrategy],
})
export class CustomerModule {}
