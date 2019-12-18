import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Emergency } from '../models/emergency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmergencyService extends TypeOrmCrudService<Emergency> {
    constructor(@InjectRepository(Emergency) public repository: Repository<Emergency>) {
        super(repository);
    }
}
