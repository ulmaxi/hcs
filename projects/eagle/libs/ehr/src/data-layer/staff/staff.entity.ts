import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from '@eagle/server-shared';
import { IsDefined } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Staff extends BaseModel {

    @PrimaryGeneratedColumn('uuid')
    @IsDefined()
    @ApiModelPropertyOptional()
    id: string;

    /**
     * the authenticaton tracking id
     */
    @IsDefined()
    @Column({ type: 'varchar', nullable: false })
    @ApiModelPropertyOptional()
    trackID: string;

    @IsDefined()
    @ApiModelProperty({ description: `The field of the staff` })
    @Column({ type: 'varchar', nullable: false })
    field: string;

    @IsDefined()
    @ApiModelPropertyOptional({ description: `The department of the staff in the institution` })
    @Column({ type: 'varchar', nullable: false })
    department: string;

    @IsDefined()
    @ApiModelProperty({ description: `The unique id for the institution` })
    @Column({ type: 'varchar', nullable: false })
    institution: string;
}
