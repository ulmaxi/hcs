import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsDefined, IsOptional, IsEmail } from 'class-validator';
import { BaseModel } from '@eagle/server-shared';
import { plainToClass } from 'class-transformer';

@Entity()
export class PersonalBiodata extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  firstname: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  lastname: string;

  @IsEmail()
  @IsOptional()
  @Column('varchar', { length: 244 })
  email: string;

  @IsDefined()
  @Column('text')
  address: string;

  @Column('float')
  @IsDefined()
  dob: number;

  @IsDefined()
  @Column('varchar')
  gender: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  town: string;

  @IsDefined()
  @Column('varchar', { length: 244 })
  trackId: string;

  static fromJSON(json: object) {
    return plainToClass(PersonalBiodata, json);
  }
}
