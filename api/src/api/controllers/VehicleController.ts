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
  QueryParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleService } from '../services/VehicleService';

class VehicleBody {
  @Type(() => Number)
  @IsInt()
  public customerId: number;

  @IsString()
  @IsNotEmpty()
  public registrationNo: string;

  @IsOptional()
  @IsString()
  public make?: string;

  @IsOptional()
  @IsString()
  public model?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public odometerKm?: number;
}

@Service()
@JsonController('/vehicles')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Get('/')
  public find(@QueryParam('customerId') customerId?: number): Promise<any> {
    return this.vehicleService.findAll(customerId ? Number(customerId) : undefined);
  }

  @Get('/:id')
  public async one(@Param('id') id: number): Promise<any> {
    const vehicle = await this.vehicleService.findOne(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    return vehicle;
  }

  @Post('/')
  @HttpCode(201)
  public create(@Body() body: VehicleBody): Promise<any> {
    return this.vehicleService.create(body);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() body: VehicleBody): Promise<any> {
    const vehicle = await this.vehicleService.update(id, body);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    return vehicle;
  }

  @Delete('/:id')
  public async delete(@Param('id') id: number): Promise<any> {
    const deleted = await this.vehicleService.delete(id);
    if (!deleted) {
      throw new NotFoundError('Vehicle not found');
    }
    return { success: true };
  }
}
