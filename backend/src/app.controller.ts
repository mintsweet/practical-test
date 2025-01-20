import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  @Get()
  wecome() {
    return {
      message: 'Welcome to our service.',
    };
  }

  @Post('upload-and-extract')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndExtract(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }
}
