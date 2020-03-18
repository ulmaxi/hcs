import { Test } from '@nestjs/testing';
import { CommunalData } from '../models/comunal-data.entity';
import { CommunalDataService } from './communal-data.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommunalData', () => {
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };
  let communalSvc: CommunalDataService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        CommunalDataService,
        {
          provide: getRepositoryToken(CommunalData),
          useValue: mockRepo,
        },
      ],
    }).compile();

    communalSvc = app.get<CommunalDataService>(CommunalDataService);
  });

  describe('instance', () => {
    it('should have repository property defined', () => {
      expect(communalSvc.repository).toBeDefined();
    });
  });
});
