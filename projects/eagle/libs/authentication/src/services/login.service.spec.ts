import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { Authorization } from '../models/author.entity';
import { Login } from '../models/login.entity';

xdescribe('LoginService', () => {
  let LoginSvc: LoginService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [LoginService],
      imports: [TypeOrmModule.forRoot({ entities: [Authorization, Login] })],
    }).compile();
    LoginSvc = app.get<LoginService>(LoginService);
  });

  describe('Instance creation', () => {
    it('should have repositiy defined', () => {
      expect(LoginSvc.repository).toBeDefined();
    });
  });
});
