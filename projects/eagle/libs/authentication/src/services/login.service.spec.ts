import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { Authorization } from '../models/author.entity';
import { Login } from '../models/login.entity';

describe('LoginService', () => {
  let LoginSvc: LoginService;
  const mockRepo = {
    metadata: {
      columns: [{ propertyName: 'id', isPrimary: true }],
      relations: [],
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: getRepositoryToken(Login), useValue: mockRepo },
      ],
    }).compile();
    LoginSvc = app.get<LoginService>(LoginService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(LoginSvc.repository).toBeDefined();
    });
  });
});
