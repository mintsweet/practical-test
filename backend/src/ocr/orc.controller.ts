import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class OcrController {
  @GrpcMethod('OcrService', 'ProcessImage')
  async processImage() {
    return {
      parsedText: '',
      errorMessage: '',
      isErrored: false,
    };
  }
}
