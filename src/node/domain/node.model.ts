import { BaseModel } from '../../base/base.model';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class Node extends BaseModel {
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID('4')
  nodeId: string | null;

  constructor(title: string, nodeId: string | null);
  constructor(title: string, nodeId: string | null, id: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null);
  constructor(
    title: string,
    nodeId: string | null,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    if (arguments.length <= 2) {
      super();
    } 
    else {
      super(id!, createdAt!, updatedAt!, deletedAt!);
    }
    this.title = title;
    this.nodeId = nodeId;
  }
}