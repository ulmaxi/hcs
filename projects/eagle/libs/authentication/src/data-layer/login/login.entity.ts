import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModel } from '@ulmax/server-shared';
import { IsNumber, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Login implements BaseModel {
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

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
