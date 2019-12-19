import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Institution } from '../models/institution.entity';
import { Repository } from 'typeorm';

/**
 * CRUD service for Institution model
 */
@Injectable()
export class InstitutionService extends TypeOrmCrudService<Institution> {
  constructor(@InjectRepository(Institution) public repository: Repository<Institution>) {
    super(repository);
  }

}
