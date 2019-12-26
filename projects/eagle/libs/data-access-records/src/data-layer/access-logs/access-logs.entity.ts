import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined, IsNumber } from 'class-validator';
import { BaseModel } from '@eagle/server-shared';

@Entity()
export class AccessLogs extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column('varchar')
  staff: string;

  @IsDefined()
  @Column('varchar')
  clientId: string;

  @IsDefined()
  @IsNumber()
  @Column('int')
  time: number;

  @IsDefined()
  @Column('varchar')
  institution: string;
}
