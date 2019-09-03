import { Test } from '@nestjs/testing';
import { PermissionRecordService } from './permission-records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionRecord } from '../models/permission-records.entity';

describe('PermissionRecordService', () => {
  let permSvc: PermissionRecordService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermissionRecordService,
        { provide: getRepositoryToken(PermissionRecord), useValue: mockRepo },
      ],
    }).compile();

    permSvc = module.get<PermissionRecordService>(PermissionRecordService);
  });

  describe('constructor', () => {
    it('should instanciate permission service', async () => {
      expect(permSvc.repository).toBeDefined();
    });
  });
});
