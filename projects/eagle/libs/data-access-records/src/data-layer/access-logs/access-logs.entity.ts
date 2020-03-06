import { BaseModel } from '@eagle/server-shared';
import { IsDefined, IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccessLogs extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column()
  staff: string;

  @IsDefined()
  @Column()
  clientId: string;

  @IsDefined()
  @IsNumber()
  @Column('int')
  time: number;

  @IsDefined()
  @Column()
  institution: string;
}
