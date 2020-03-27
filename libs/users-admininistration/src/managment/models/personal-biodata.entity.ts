import { BaseModel } from '@ulmax/server-shared';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PersonalBiodata implements BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column({ length: 244 })
  firstname: string;

  @IsDefined()
  @Column({ length: 244 })
  lastname: string;

  @IsEmail()
  @IsOptional()
  @Column({ length: 244, nullable: true })
  email: string;

  @IsDefined()
  @Column('text')
  address: string;

  @Column('date')
  @IsDefined()
  dob: Date;

  @IsDefined()
  @Column()
  gender: string;

  @IsDefined()
  @Column({ length: 244 })
  town: string;

  @IsDefined()
  @Column({ length: 244 })
  cardnode: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
