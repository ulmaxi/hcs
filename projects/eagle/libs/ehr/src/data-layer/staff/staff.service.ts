import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Staff } from '../models/staff.entity';
import { Repository } from 'typeorm';

/**
 * CRUD service for Staff model
 */
@Injectable()
export class StaffService extends TypeOrmCrudService<Staff> {
  constructor(@InjectRepository(Staff) public repository: Repository<Staff>) {
    super(repository);
  }

}
