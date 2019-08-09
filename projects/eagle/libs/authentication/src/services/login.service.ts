import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Login } from '../models/login.entity';
import { Repository } from 'typeorm';

/**
 * CRUD service for login model
 */
@Injectable()
export class LoginService extends TypeOrmCrudService<Login> {
  constructor(@InjectRepository(Login) public repository: Repository<Login>) {
    super(repository);
  }
}
