import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessLogs } from './access-logs.entity';
import { AccessLogService } from './access-logs.service';

describe('AccessLogService', () => {
  let permSvc: AccessLogService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccessLogService,
        { provide: getRepositoryToken(AccessLogs), useValue: mockRepo },
      ],
    }).compile();

    permSvc = module.get<AccessLogService>(AccessLogService);
  });

  describe('constructor', () => {
    it('should instanciate permission service', () => {
      expect(permSvc.repository).toBeDefined();
    });
  });
});
