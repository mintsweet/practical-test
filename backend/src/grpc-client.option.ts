import { join } from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'ocr',
    protoPath: join(__dirname, './ocr/ocr.proto'),
  },
};
