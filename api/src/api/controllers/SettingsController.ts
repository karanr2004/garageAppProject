import { Body, Get, JsonController, Put } from 'routing-controllers';
import { Service } from 'typedi';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SettingsService } from '../services/SettingsService';

class SettingsBody {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public garageName?: string;

  @IsOptional()
  @IsString()
  public location?: string;

  @IsOptional()
  @IsString()
  public phone?: string;
}

@Service()
@JsonController('/settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/')
  public get(): Promise<any> {
    return this.settingsService.get();
  }

  @Put('/')
  public update(@Body() body: SettingsBody): Promise<any> {
    return this.settingsService.update(body);
  }
}
