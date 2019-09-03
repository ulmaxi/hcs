import * as generated from '@eagle/generated';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';
import { BaseModel } from '@eagle/server-shared';
import { plainToClass } from 'class-transformer';

@Entity()
export class CommunalData extends BaseModel
  implements generated.UserCommunalData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  trackId: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  maritalstatus: string;

  @IsOptional()
  @Column('varchar', { length: 244 })
  religion: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  nextofkin: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  nextofkinphoneNo: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  lgaorigin: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  stateoforigin: string;

  @IsOptional()
  @Column('varchar', { length: 244 })
  employerphoneNo: string;

  @IsOptional()
  @Column('varchar', { length: 244 })
  employerAddress: string;

  static fromJSON(json: object) {
    return plainToClass(CommunalData, json);
  }
}
