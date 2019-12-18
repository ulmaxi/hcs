import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from '@eagle/server-shared';
import { IsDefined } from 'class-validator';

@Entity()
export class Emergency extends BaseModel {

    /**
     * primary uniqueId for each emergency case
     */
    @PrimaryGeneratedColumn('uuid')
    @IsDefined()
    id?: string;

    /**
     * what's happening on ground and how bad
     */
    @Column('v')
    @IsDefined()
    assessment: string;

    /**
     * The time the accident occurred
     */
    @Column('date')
    @IsDefined()
    time: string;

    /**
     * location of where the emergency is
     */
    @Column('varchar')
    @IsDefined()
    address: string;

    /**
     * the phone No to contact someone at the emergency scene
     */
    @Column('varchar')
    @IsDefined()
    contact: string;

    /**
     * the hospital to respond to the emergency
     */
    @Column('varchar')
    @IsDefined()
    hospital: string;
}
