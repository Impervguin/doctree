import { BaseModel } from '../../base/base.model';
import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateObject } from '../../utils/validate.throw';

export class Tree extends BaseModel {
  @IsString()
  title: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Tree)
  children?: Tree[];

  constructor(title: string);
  constructor(
    title: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
    children?: Tree[]
  );
  constructor(
    title: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
    children?: Tree[]
  ) {
    if (arguments.length === 1) {
      super();
    } else {
      super(id!, createdAt!, updatedAt!, deletedAt!);
    }
    this.title = title;
    this.children = children || [];
    ValidateObject(this);
  }
}