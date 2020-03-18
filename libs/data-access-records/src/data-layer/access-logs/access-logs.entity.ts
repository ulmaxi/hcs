import { BaseModel } from '@ulmax/server-shared';
import { IsDefined, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AccessLogs implements BaseModel {
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

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
