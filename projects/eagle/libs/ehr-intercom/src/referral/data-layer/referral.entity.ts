import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Referral extends BaseModel {

  @PrimaryGeneratedColumn('uuid')
  @ApiModelProperty()
  id: string;

}
