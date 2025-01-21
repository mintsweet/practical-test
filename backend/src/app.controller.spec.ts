import { Test, TestingModule } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import { of } from 'rxjs';

import { AppController } from './app.controller';

class MockGrpcClient {
  getService<T>(): T {
    return {
      ProcessImage: jest.fn().mockImplementation(() => {
        return of({
          lines: [
            {
              text: 'Example Line',
              minTop: 10,
              minHeight: 20,
              words: [
                {
                  text: 'Example',
                  top: 10,
                  left: 15,
                  width: 50,
                  height: 20,
                },
              ],
            },
          ],
          isError: false,
          errorMsg: '',
        });
      }),
    } as unknown as T;
  }
}

describe('AppController', () => {
  let appController: AppController;
  let grpcClient: ClientGrpc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'OCR_PACKAGE',
          useClass: MockGrpcClient,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appController.onModuleInit();
    grpcClient = module.get<ClientGrpc>('OCR_PACKAGE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return welcome message', () => {
    expect(appController.welcome()).toEqual({
      message: 'Welcome to our service.',
    });
  });

  it('should process file upload and extraction', async () => {
    const mockFile = {
      filename: 'test-file.jpg',
    } as Express.Multer.File;

    const result = await appController.uploadAndExtract(mockFile);

    expect(result).toEqual({
      fileName: 'test-file.jpg',
      lines: [
        {
          text: 'Example Line',
          minTop: 10,
          minHeight: 20,
          words: [
            {
              text: 'Example',
              top: 10,
              left: 15,
              width: 50,
              height: 20,
            },
          ],
        },
      ],
      isError: false,
      errorMsg: '',
    });
  });
});
