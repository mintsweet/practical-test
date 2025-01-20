import * as path from 'path';

import * as fs from 'fs';

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import * as FormData from 'form-data';
import axios from 'axios';

@Controller()
export class OcrController {
  constructor(private readonly configService: ConfigService) {}

  @GrpcMethod('OcrService', 'ProcessImage')
  async processImage({
    fileName,
    language = 'eng',
  }: {
    fileName: string;
    language?: string;
  }) {
    const UPLOAD_DIR = this.configService.get<string>('UPLOAD_DIR');
    const OCR_API_URL = this.configService.get<string>('OCR_API_URL');
    const OCR_API_KEY = this.configService.get<string>('OCR_API_KEY');

    const filePath = path.join(UPLOAD_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('Cannot find this file');
    }

    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('language', language);
      formData.append('isOverlayRequired', 'true');

      const response = await axios.post(OCR_API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          apiKey: OCR_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
