import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Institution } from './institution.entity';

/**
 * CRUD service for Institution model
 */
@Injectable()
export class InstitutionService extends TypeOrmCrudService<Institution> {
  constructor(@InjectRepository(Institution) public repository: Repository<Institution>) {
    super(repository);
  }

}
