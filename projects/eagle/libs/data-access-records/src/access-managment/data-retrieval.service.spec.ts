import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { DataRetrievalService } from './data-retrieval.service';

const clientMock = {
  send: jest.fn,
};

xdescribe('Controller', () => {
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
