import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { OcrModule } from './ocr/ocr.module';
import { grpcClientOptions } from './grpc-client.option';
import { AppController } from './app.controller';

@Module({
  imports: [
    OcrModule,
    ClientsModule.register([
      {
        name: 'OCR_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
