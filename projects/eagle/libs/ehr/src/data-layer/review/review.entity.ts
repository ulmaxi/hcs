import { BaseModel } from '@eagle/server-shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * datastructure for review, which doctors do on
 * admitted patients
 */
@Entity()
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
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    consulationTrackId: string;

    /**
     * the id of the staff who did the consultation
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    staffId: string;

    /**
     * the Id for the admission since the review is done inside the ward
     */
    @IsDefined()
    @Column({  nullable: false, update: false })
    @ApiModelProperty()
    admissionId: string;

    /**
     * the department which the consultaion was done
     */
    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty()
    department: string;

    /**
     * a note on the patient apart from the consultation.
     */
    @IsDefined()
    @Column({  nullable: false })
    @ApiModelProperty()
    note: string;
}
