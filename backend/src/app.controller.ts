import {
  Controller,
  OnModuleInit,
  Inject,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, lastValueFrom } from 'rxjs';

interface OcrService {
  ProcessImage(data: { fileName: string; language?: string }): Observable<{}>;
}

@Controller()
export class AppController implements OnModuleInit {
  private ocrService: OcrService;

  constructor(@Inject('OCR_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.ocrService = this.client.getService<OcrService>('OcrService');
  }

  @Get()
  welcome() {
    return {
      message: 'Welcome to our service.',
    };
  }

  @Post('upload-and-extract')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndExtract(@UploadedFile() file: Express.Multer.File) {
    const fileName = file.filename;
    const result = await lastValueFrom(
      this.ocrService.ProcessImage({
        fileName,
      }),
    );

    return {
      fileName,
      ...result,
    };
  }
}
