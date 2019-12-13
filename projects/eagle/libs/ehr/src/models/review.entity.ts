import { BaseModel } from '@eagle/server-shared';
import { IsDefined } from 'class-validator';
import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';

/**
 * datastructure for review, which doctors do on
 * admitted patients
 */
export class Review extends BaseModel {
    /**
     * the uniqueId for each ward review
     */
    @IsDefined()
    @PrimaryGeneratedColumn('uuid')
    @ApiModelPropertyOptional()
    id: string;

    /**
     * the consulation TrackId for continuation
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false, update: false })
    @ApiModelProperty()
    consulationTrackId: string;

    /**
     * the Id for the new consultation
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false, update: false })
    @ApiModelProperty()
    consultantionId: string;

    /**
     * the department which the consultaion was done
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelProperty()
    department: string;

    /**
     * a note on the patient apart from the consultation.
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelProperty()
    note: string;
}
