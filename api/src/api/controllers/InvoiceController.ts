import {
  Body,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceService } from '../services/InvoiceService';

class InvoiceItemBody {
  @IsString()
  public description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public amount: number;
}

class CreateInvoiceBody {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public jobCardId?: number;

  @Type(() => Number)
  @IsInt()
  public customerId: number;

  @Type(() => Number)
  @IsInt()
  public vehicleId: number;

  @IsOptional()
  @IsString()
  public invoiceDate?: string;

  @IsOptional()
  @IsString()
  public paymentMethod?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public nextServiceKm?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemBody)
  public items: InvoiceItemBody[];
}

@Service()
@JsonController('/invoices')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('/')
  public find(): Promise<any> {
    return this.invoiceService.findAll();
  }

  @Get('/:id')
  public async one(@Param('id') id: number): Promise<any> {
    const invoice = await this.invoiceService.findOne(id);
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }
    return invoice;
  }

  @Post('/')
  @HttpCode(201)
  public create(@Body() body: CreateInvoiceBody): Promise<any> {
    return this.invoiceService.create(body);
  }
}
