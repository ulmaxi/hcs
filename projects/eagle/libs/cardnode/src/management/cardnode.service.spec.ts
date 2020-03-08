import { Test, TestingModule } from '@nestjs/testing';
import { microServiceToken } from '@ulmax/server-shared';
import { cardNodeFactory, communalBiodataFactory, personalBiodataFactory, RepoMock } from '@ulmax/testing';
import { UlmaxCardService } from '../data-layer/card/card.service';
import { CardMemberService } from './cardnode.service';

describe('CardMemberService', () => {
  let svc: CardMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardMemberService,
        { provide: UlmaxCardService, useValue: { repository: new RepoMock() } },
        { provide: microServiceToken, useValue: { send: jest.fn(), emit: jest.fn() } },
      ],
    }).compile();

    svc = module.get<CardMemberService>(CardMemberService);
  });

  describe('addMember', () => {
    const biodata = personalBiodataFactory.build({});
    const communaldata = communalBiodataFactory.build({ });
    it('should return the card for the member', async () => {
      const card = cardNodeFactory.build({  });
      expect(await svc.addMember(card.cardNo, { communaldata, biodata })).toStrictEqual(card);
    });
  });

});
