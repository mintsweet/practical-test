import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OcrController } from './ocr.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [OcrController],
  providers: [ConfigService],
})
export class OcrModule {}
