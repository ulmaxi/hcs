import { Test } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { authorizationFactory, cardNodeFactory, communalBiodataFactory, personalBiodataFactory, TypeService } from '@ulmax/testing';
import { UlmaxCardLevel } from '../data-layer/card/card.entity';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { UlmaxFullCard } from '../typecast';
import { CardCreatorService } from './card-creator.service';

describe('CardCreatorService', () => {
  let svc: CardCreatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CardCreatorService,
        { provide: UlmaxCardService, useValue: new TypeService() },
        {
          provide: microServiceToken,
          useValue: { send: jest.fn(), emit: jest.fn() },
        },
      ],
    }).compile();

    svc = module.get<CardCreatorService>(CardCreatorService);
  });

  describe('addMember', () => {
    const biodata = personalBiodataFactory.build({});
    const communaldata = communalBiodataFactory.build({});
    it('should return the card for the member', async () => {
      const card = cardNodeFactory.build({ level: UlmaxCardLevel.Minor });
      expect(
        await svc.saveMember({ communaldata, biodata, cardNo: card.cardNo }),
      ).toStrictEqual({ biodata, card, communaldata } as UlmaxFullCard);
    });
  });

  describe('addPrincipal', () => {
    const biodata = personalBiodataFactory.build({});
    const communaldata = communalBiodataFactory.build({});
    const auth = authorizationFactory.build();
    it('should save the principal with identification and level', async () => {
      const card = cardNodeFactory.build({
        level: UlmaxCardLevel.Admin,
        trackId: auth.trackId,
      });
      expect(
        await svc.addPrincipal(card.cardNo, {
          communaldata,
          biodata,
          identification: auth.identification,
        }),
      ).toStrictEqual({ biodata, card, communaldata } as UlmaxFullCard);
    });
  });
});
