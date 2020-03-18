import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LabTest } from './labtest.entity';
import { Repository } from 'typeorm';

/**
 * CRUD service for LabTest model
 */
@Injectable()
export class LabTestService extends TypeOrmCrudService<LabTest> {
  constructor(
    @InjectRepository(LabTest) public repository: Repository<LabTest>,
  ) {
    super(repository);
  }
}
