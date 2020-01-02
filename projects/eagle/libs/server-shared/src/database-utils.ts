// tslint:disable: max-classes-per-file
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

/**
 * the base model which all model must extend and be derived from
 */
@Entity()
export class BaseModel {
  /**
   * time which the model was created originally
   */
  @CreateDateColumn()
  createdAt?: Date;

  /**
   * the last time it was updated by
   */
  @UpdateDateColumn()
  updatedAt?: Date;
}

/**
 * filtered database generated fields from models
 */
export type UnsavedModel<T extends BaseModel> = Omit<T, 'createdAt' | 'updatedAt' | 'id'>;

/**
 * Interface for queryparams structuring
 */
export class FindQueryParams {
  /**
   * amount to skip
   */
  @ApiModelPropertyOptional()
  skip?: number;

  /**
   * the limit of feed to return
   */
  @ApiModelPropertyOptional()
  limit?: number;

  /** would create a class from the JSON object */
  static fromJson(json: object) {
    return plainToClass(FindQueryParams, json);
  }
}

/**
 * Interface for queryparams structuring
 */
export class SearchQueryParams extends FindQueryParams {
  /**
   * the search query to provide
   */
  @ApiModelPropertyOptional()
  search?: string;

}

export interface FindProperties<T> {
  data: T[];
  total: number;
}

export class FindResponse<T> extends FindQueryParams {
  /**
   * the actual data returned
   */
  @ApiModelPropertyOptional()
  data?: T[];

  /**
   * the total data found
   */
  @ApiModelPropertyOptional()
  total: number;

  /** would create a class from the JSON object */
  static fromJson<T>(json: FindQueryParams & FindProperties<T>) {
    return plainToClass(FindResponse, json) as FindResponse<T>;
  }
}
