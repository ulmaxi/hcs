import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    @Column()
    @IsDefined()
    @ApiModelProperty()
    assessment: string;

    /**
     * The time the accident occurred
     */
    @Column('date')
    @IsDefined()
    @ApiModelProperty()
    time: string;

    /**
     * location of where the emergency is
     */
    @Column()
    @IsDefined()
    @ApiModelProperty()
    address: string;

    /**
     * the phone No to contact someone at the emergency scene
     */
    @Column()
    @IsDefined()
    @ApiModelProperty()
    contact: string;

    /**
     * the hospital to respond to the emergency
     */
    @Column()
    @IsDefined()
    @ApiModelProperty()
    hospital: string;
}
