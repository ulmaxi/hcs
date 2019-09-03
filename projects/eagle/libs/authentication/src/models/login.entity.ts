import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ILogin } from '@eagle/generated';
import { BaseModel } from '@eagle/server-shared';
import { IsNumber, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Login extends BaseModel implements ILogin {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @IsNumber()
  @Column({ type: 'float' })
  expires: number;

  @ApiModelProperty()
  @IsNumber()
  @Column('int')
  otp: number;

  @ApiModelProperty()
  @IsString()
  @Column('varchar')
  trackingId: string;
}
