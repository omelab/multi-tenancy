import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  @Get('/list')
  list(): string {
    return 'all tanent list';
  }
}
