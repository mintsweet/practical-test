import { join } from 'path';

import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';

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
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', 'uploads'),
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/static',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
