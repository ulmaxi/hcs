import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionRecord } from '../models/permission-records.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class PermissionRecordService extends TypeOrmCrudService<
  PermissionRecord
> {
  constructor(
    @InjectRepository(PermissionRecord)
    public repository: Repository<PermissionRecord>,
  ) {
    super(repository);
  }
}
