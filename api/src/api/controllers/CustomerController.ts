import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { Service } from 'typedi';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CustomerService } from '../services/CustomerService';

class CustomerBody {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public phone: string;

  @IsOptional()
  @IsString()
  public address?: string;
}

@Service()
@JsonController('/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('/')
  public find(): Promise<any> {
    return this.customerService.findAll();
  }

  @Get('/:id')
  public async one(@Param('id') id: number): Promise<any> {
    const customer = await this.customerService.findOne(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer;
  }

  @Post('/')
  @HttpCode(201)
  public create(@Body() body: CustomerBody): Promise<any> {
    return this.customerService.create(body);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() body: CustomerBody): Promise<any> {
    const customer = await this.customerService.update(id, body);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer;
  }

  @Delete('/:id')
  public async delete(@Param('id') id: number): Promise<any> {
    const deleted = await this.customerService.delete(id);
    if (!deleted) {
      throw new NotFoundError('Customer not found');
    }
    return { success: true };
  }
}
