import {
  Body,
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
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { JobCardService } from '../services/JobCardService';
import { JobCardStatus } from '../models/JobCard';

class JobCardBody {
  @Type(() => Number)
  @IsInt()
  public customerId: number;

  @Type(() => Number)
  @IsInt()
  public vehicleId: number;

  @IsOptional()
  @IsString()
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'BILLED'])
  public status?: JobCardStatus;

  @IsOptional()
  @IsString()
  public notes?: string;
}

class JobCardUpdateBody {
  @IsOptional()
  @IsString()
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'BILLED'])
  public status?: JobCardStatus;

  @IsOptional()
  @IsString()
  public notes?: string;
}

@Service()
@JsonController('/job-cards')
export class JobCardController {
  constructor(private jobCardService: JobCardService) {}

  @Get('/')
  public find(@QueryParam('status') status?: JobCardStatus): Promise<any> {
    return this.jobCardService.findAll(status);
  }

  @Get('/:id')
  public async one(@Param('id') id: number): Promise<any> {
    const jobCard = await this.jobCardService.findOne(id);
    if (!jobCard) {
      throw new NotFoundError('Job card not found');
    }
    return jobCard;
  }

  @Post('/')
  @HttpCode(201)
  public create(@Body() body: JobCardBody): Promise<any> {
    return this.jobCardService.create(body);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() body: JobCardUpdateBody): Promise<any> {
    const jobCard = await this.jobCardService.update(id, body);
    if (!jobCard) {
      throw new NotFoundError('Job card not found');
    }
    return jobCard;
  }

  @Post('/:id/complete')
  public async complete(@Param('id') id: number): Promise<any> {
    const jobCard = await this.jobCardService.complete(id);
    if (!jobCard) {
      throw new NotFoundError('Job card not found');
    }
    return jobCard;
  }
}
