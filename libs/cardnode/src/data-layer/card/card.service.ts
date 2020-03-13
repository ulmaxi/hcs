import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { UlmaxCard } from './card.entity';

/**
 * CRUD service for UlmaxCard model
 */
@Injectable()
export class UlmaxCardService extends TypeOrmCrudService<UlmaxCard> {
  constructor(@InjectRepository(UlmaxCard) public repository: Repository<UlmaxCard>) {
    super(repository);
  }

}
