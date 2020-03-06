import { Test } from '@nestjs/testing';
import { PersonalBiodataService } from './person-biodata.service';
import { PersonalBiodata } from '../models/personal-biodata.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PersonalBiodataService', () => {
  let personalSvc: PersonalBiodataService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        PersonalBiodataService,
        { provide: getRepositoryToken(PersonalBiodata), useValue: mockRepo },
      ],
    }).compile();

    personalSvc = app.get<PersonalBiodataService>(PersonalBiodataService);
  });

  describe('instance', () => {
    it('should have repository property defined', async () => {
      expect(personalSvc.repository).toBeDefined();
    });
  });
});
