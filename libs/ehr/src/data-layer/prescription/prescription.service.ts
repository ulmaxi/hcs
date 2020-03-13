import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Prescription } from './prescription.entity';
import { Repository } from 'typeorm';

/**
 * CRUD service for Prescription model
 */
@Injectable()
export class PrescriptionService extends TypeOrmCrudService<Prescription> {
  constructor(@InjectRepository(Prescription) public repository: Repository<Prescription>) {
    super(repository);
  }

}
