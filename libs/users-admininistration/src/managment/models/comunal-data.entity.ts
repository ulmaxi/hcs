import { BaseModel } from '@ulmax/server-shared';
import { IsDefined, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CommunalData implements BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column({ length: 244 })
  cardnode: string;

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
  lga: string;

  @IsDefined()
  @Column({ length: 244 })
  state: string;

  @IsOptional()
  @Column({ length: 244, nullable: true })
  employerphoneNo: string;

  @IsOptional()
  @Column({ length: 244, nullable: true})
  employer: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
