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

export interface OcrService {
  ProcessImage(payload: { fileName: string; language?: string }): Observable<{
    lines: Array<{
      text: string;
      minTop: number;
      minHeight: number;
      words: Array<{
        text: string;
        top: number;
        left: number;
        width: number;
        height: number;
      }>;
    }>;
    isError: boolean;
    errorMsg: string;
  }>;
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
