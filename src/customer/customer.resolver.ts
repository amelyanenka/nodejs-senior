import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  CreateCustomerInput,
  CustomerInput,
  GetCustomersInput,
  UpdateCustomerInput,
} from './dto/customer.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';

@UseGuards(GqlAuthGuard)
@UseGuards(RolesGuard)
@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async getAllCustomers(
    @Args('data') { skip, take, where }: GetCustomersInput,
  ) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Query(() => Customer)
  async getCustomer(@Args('input') input: CustomerInput) {
    return this.customerService.findOne(input);
  }

  @Role('ADMIN')
  @Mutation(() => Customer)
  async createCustomer(@Args('data') data: CreateCustomerInput) {
    return this.customerService.create(data);
  }

  @Role('ADMIN')
  @Mutation(() => Customer)
  async updateCustomer(
    @Args('input') input: CustomerInput,
    @Args('data') data: UpdateCustomerInput,
  ) {
    return this.customerService.update(input, data);
  }

  @Role('ADMIN')
  @Mutation(() => Customer)
  async deleteCustomer(@Args('input') input: CustomerInput) {
    return this.customerService.delete(input);
  }
}
