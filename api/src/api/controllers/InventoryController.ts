import { Body, Get, HttpCode, JsonController, Param, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { InventoryService } from '../services/InventoryService';

class CreateInventoryBody {
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public sku?: string;

  @IsOptional()
  @IsInt()
  public quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public unitPrice?: number;
}

@Service()
@JsonController('/inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('/')
  public find(): Promise<any> {
    return this.inventoryService.findAll();
  }

  @Get('/:id')
  public one(@Param('id') id: number) {
    return this.inventoryService.findOne(id);
  }

  @Post('/')
  @HttpCode(201)
  public create(@Body() body: CreateInventoryBody) {
    return this.inventoryService.create(body as any);
  }
}
