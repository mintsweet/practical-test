import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  wecome() {
    return {
      message: 'Welcome to our service.',
    };
  }
}
