import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomerService } from './customer/customer.service';
import { GetCustomersInput } from './customer/dto/customer.input';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly customerService: CustomerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check health' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/customers')
  @ApiOperation({ summary: 'DEV: See all customers without auth' })
  @ApiResponse({ status: 200, description: 'Return all customers' })
  async getCustomers(): Promise<any> {
    return await this.customerService.findAll({} as GetCustomersInput);
  }
}
