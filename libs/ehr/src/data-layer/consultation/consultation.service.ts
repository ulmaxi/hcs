import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './consultation.entity';

/**
 * CRUD service for Consultation model
 */
@Injectable()
export class ConsultationService extends TypeOrmCrudService<Consultation> {
  constructor(
    @InjectRepository(Consultation) public repository: Repository<Consultation>,
  ) {
    super(repository);
  }
}
