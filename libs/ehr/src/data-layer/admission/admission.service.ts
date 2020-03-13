import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Admission } from './admission.entity';
import { Repository } from 'typeorm';

/**
 * CRUD service for Admission model
 */
@Injectable()
export class AdmissionService extends TypeOrmCrudService<Admission> {
  constructor(@InjectRepository(Admission) public repository: Repository<Admission>) {
    super(repository);
  }

}
