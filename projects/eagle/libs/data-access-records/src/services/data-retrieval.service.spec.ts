import { Test } from '@nestjs/testing';
import { DataRetrievalService } from './data-retrieval.service';
import { microServiceToken } from '@eagle/server-shared';
import { ClientProxy } from '@nestjs/microservices';

const clientMock = {
  send: jest.fn,
};

describe('Controller', () => {
  let retrievalSvc: DataRetrievalService;
  let clientSvc: ClientProxy;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        DataRetrievalService,
        { provide: microServiceToken, useValue: clientMock },
      ],
    }).compile();

    clientSvc = app.get<ClientProxy>(microServiceToken);
    retrievalSvc = app.get<DataRetrievalService>(DataRetrievalService);
  });

  it('should skip', () => {
    
  });
  
});
