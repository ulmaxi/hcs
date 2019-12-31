import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined, IsNumber, IsBoolean } from 'class-validator';
import { BaseModel } from '@eagle/server-shared';

@Entity()
export class PermissionRecord extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column('varchar')
  institution: string;

  @IsDefined()
  @Column('date')
  expires: Date;

  @IsDefined()
  @IsNumber()
  @Column('int')
  code: number;

  @IsBoolean()
  @Column('boolean')
  authorized: boolean = false;

  @IsDefined()
  @Column('varchar')
  clientId: string;
}
