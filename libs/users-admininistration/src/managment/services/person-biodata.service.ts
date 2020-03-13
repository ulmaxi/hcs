import { PersonalBiodata } from '../models/personal-biodata.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PersonalBiodataService extends TypeOrmCrudService<
  PersonalBiodata
> {
  constructor(
    @InjectRepository(PersonalBiodata)
    public repository: Repository<PersonalBiodata>,
  ) {
    super(repository);
  }
}
