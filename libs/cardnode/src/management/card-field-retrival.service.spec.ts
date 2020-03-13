import { Test } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { TypeService } from '@ulmax/testing';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { CardFieldRetrivalService } from './card-field-retrival.service';

describe('Controller', () => {
  let svc: CardFieldRetrivalService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CardFieldRetrivalService,
        { provide: UlmaxCardService, useValue: new TypeService() },
        {
          provide: microServiceToken,
          useValue: { send: jest.fn(), emit: jest.fn() },
        },
      ],
    }).compile();

    svc = module.get<CardFieldRetrivalService>(CardFieldRetrivalService);
  });
});
