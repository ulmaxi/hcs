import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Login extends BaseModel {
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
  @Column()
  trackingId: string;
}
