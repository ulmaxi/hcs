import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ILogin } from '@eagle/generated';
import { BaseModel } from '@eagle/server-shared';
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class Login extends BaseModel implements ILogin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNumber()
  @Column({ type: 'float' })
  expires: number;

  @IsNumber()
  @Column('int')
  otp: number;

  @IsString()
  @Column('varchar')
  trackingId: string;
}
