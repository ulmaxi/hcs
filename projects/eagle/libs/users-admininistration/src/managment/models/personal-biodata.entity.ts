import { BaseModel } from '@eagle/server-shared';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PersonalBiodata extends BaseModel {
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
  @Column({ length: 244 })
  email: string;

  @IsDefined()
  @Column('text')
  address: string;

  @Column('float')
  @IsDefined()
  dob: number;

  @IsDefined()
  @Column()
  gender: string;

  @IsDefined()
  @Column({ length: 244 })
  town: string;

  @IsDefined()
  @Column({ length: 244 })
  trackId: string;

}
