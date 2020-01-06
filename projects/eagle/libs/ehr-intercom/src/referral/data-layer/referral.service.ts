import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Referral } from './referral.entity';

@Injectable()
export class ReferralService extends TypeOrmCrudService<Referral> {
    constructor(@InjectRepository(Referral) public repository: Repository<Referral>) {
        super(repository);
    }
}
