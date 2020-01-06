import { BaseModel } from '@eagle/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommunalData extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column({ length: 244 })
  trackId: string;

  @IsDefined()
  @Column({ length: 244 })
  maritalstatus: string;

  @IsOptional()
  @Column({ length: 244 })
  religion: string;

  @IsDefined()
  @Column({ length: 244 })
  nextofkin: string;

  @IsDefined()
  @Column({ length: 244 })
  nextofkinphoneNo: string;

  @IsDefined()
  @Column({ length: 244 })
  lgaorigin: string;

  @IsDefined()
  @Column({ length: 244 })
  stateoforigin: string;

  @IsOptional()
  @Column({ length: 244 })
  employerphoneNo: string;

  @IsOptional()
  @Column({ length: 244 })
  employerAddress: string;

}
