import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { consultationFactory } from '@ulmax/testing';
import { of } from 'rxjs';
import { HistorySnaphotService } from './snapshot.service';

describe('HistorySnaphotService', () => {
  let svc: HistorySnaphotService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HistorySnaphotService,
        {
          provide: microServiceToken,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    client = module.get<ClientProxy>(microServiceToken);
    svc = module.get<HistorySnaphotService>(HistorySnaphotService);
  });

  describe('graph', () => {
    it('should return call the transport', async () => {
      const spy = jest.spyOn(client, 'send').mockReturnValueOnce(of([]));
      await svc.graph(consultationFactory.build(), {});
      expect(spy).toHaveBeenCalled();
    });
  });
});
