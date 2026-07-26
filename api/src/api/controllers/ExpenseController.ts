import { Body, Get, HttpCode, JsonController, Param, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ExpenseService } from '../services/ExpenseService';

class CreateExpenseBody {
  @IsOptional()
  @IsString()
  public date?: string;

  @IsString()
  public category: string;

  @IsNumber()
  public amount: number;

  @IsOptional()
  @IsString()
  public notes?: string;
}

@Service()
@JsonController('/expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get('/')
  public find(): Promise<any> {
    return this.expenseService.findAll();
  }

  @Get('/:id')
  public one(@Param('id') id: number) {
    return this.expenseService.findOne(id);
  }

  @Post('/')
  @HttpCode(201)
  public create(@Body() body: CreateExpenseBody) {
    return this.expenseService.create(body as any);
  }
}
