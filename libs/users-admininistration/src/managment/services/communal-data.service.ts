import { CommunalData } from '../models/comunal-data.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommunalDataService extends TypeOrmCrudService<
CommunalData
> {
  constructor(
    @InjectRepository(CommunalData)
    public repository: Repository<CommunalData>,
  ) {
    super(repository);
  }
}
