import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Login } from './login.entity';

/**
 * CRUD service for login model
 */
@Injectable()
export class LoginService extends TypeOrmCrudService<Login> {
  constructor(@InjectRepository(Login) public repository: Repository<Login>) {
    super(repository);
  }
}
