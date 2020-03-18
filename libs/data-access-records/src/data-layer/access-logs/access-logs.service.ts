import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessLogs } from './access-logs.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class AccessLogService extends TypeOrmCrudService<AccessLogs> {
  constructor(
    @InjectRepository(AccessLogs)
    public repository: Repository<AccessLogs>,
  ) {
    super(repository);
  }
}
