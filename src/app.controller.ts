import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  @ApiTags('Health')
  @ApiOperation({ summary: 'Welcome' })
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
