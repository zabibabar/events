import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//my-website.com/

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
