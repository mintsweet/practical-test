import * as fs from 'fs';

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { OcrController } from './ocr.controller';

jest.mock('fs');
jest.mock('axios');
jest.mock('form-data');

describe('OcrController', () => {
  let ocrController: OcrController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcrController],
      providers: [ConfigService],
    }).compile();

    ocrController = module.get<OcrController>(OcrController);
    configService = module.get<ConfigService>(ConfigService);

    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      switch (key) {
        case 'UPLOAD_DIR':
          return '/mock/upload/dir';
        case 'OCR_API_URL':
          return 'http://mock-ocr-api.com';
        case 'OCR_API_KEY':
          return 'mock-api-key';
        default:
          return null;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await ocrController.processImage({
      fileName: 'nonexistent.jpg',
      language: 'eng',
    });

    expect(result).toEqual({
      isError: true,
      errorMsg: 'Cannot find this file',
      lines: [],
    });
  });

  it('should return an error if the OCR API returns an error', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream' as any);
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        OCRExitCode: 3,
        ErrorMessage: 'Mock OCR error',
      },
    });

    const result = await ocrController.processImage({
      fileName: 'mock-file.jpg',
      language: 'eng',
    });

    expect(result).toEqual({
      isError: true,
      errorMsg: 'Mock OCR error',
      lines: [],
    });
  });

  it('should return parsed lines if the OCR API succeeds', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream' as any);
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        OCRExitCode: 1,
        ParsedResults: [
          {
            TextOverlay: {
              Lines: [
                {
                  LineText: 'Hello, World!',
                  MinTop: 10,
                  MaxHeight: 20,
                  Words: [
                    {
                      WordText: 'Hello,',
                      Top: 10,
                      Left: 15,
                      Width: 40,
                      Height: 20,
                    },
                    {
                      WordText: 'World!',
                      Top: 10,
                      Left: 60,
                      Width: 50,
                      Height: 20,
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    });

    const result = await ocrController.processImage({
      fileName: 'mock-file.jpg',
      language: 'eng',
    });

    expect(result).toEqual({
      isError: false,
      errorMsg: '',
      lines: [
        {
          text: 'Hello, World!',
          minTop: 10,
          maxHeight: 20,
          words: [
            {
              text: 'Hello,',
              top: 10,
              left: 15,
              width: 40,
              height: 20,
            },
            {
              text: 'World!',
              top: 10,
              left: 60,
              width: 50,
              height: 20,
            },
          ],
        },
      ],
    });
  });

  it('should return an error if an exception occurs', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
      throw new Error('Mock file error');
    });

    const result = await ocrController.processImage({
      fileName: 'mock-file.jpg',
      language: 'eng',
    });

    expect(result).toEqual({
      isError: true,
      errorMsg: 'Mock file error',
      lines: [],
    });
  });
});
