import { Module } from '@nestjs/common';

import { OcrController } from './orc.controller';

@Module({
  imports: [],
  controllers: [OcrController],
  providers: [],
})
export class OcrModule {}
