import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Authorization } from './author.entity';

/**
 * CRUD service for Authorization model
 */
@Injectable()
export class AuthorService extends TypeOrmCrudService<Authorization> {
  constructor(
    @InjectRepository(Authorization)
    public repository: Repository<Authorization>,
  ) {
    super(repository);
  }
}
