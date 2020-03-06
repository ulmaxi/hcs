import { BaseModel } from '@eagle/server-shared';
import { IsBoolean, IsDefined, IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PermissionRecord extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column()
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
  @Column()
  clientId: string;
}
