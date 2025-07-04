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

  hasCycle(): boolean {
    const visited = new Set<string>();
    const CurrentPath = new Set<string>();
    
    // DFS traversal
    const hasCycleUtil = (node: Tree): boolean => {   
      if (CurrentPath.has(node.id)) {
        // if in current path, then it's a cycle
        return true;
      }
      
      if (visited.has(node.id)) {
        // If we've already visited this node but it's not in the current path,
        // then it's not part of a cycle in this path (already checked all children's paths)
        return false;
      }
      
      visited.add(node.id);
      CurrentPath.add(node.id);
      
      if (node.children) {
        for (const child of node.children) {
          if (hasCycleUtil(child)) {
            return true;
          }
        }
      }
      
      CurrentPath.delete(node.id);
      
      return false;
    };
    
    return hasCycleUtil(this);
  }
}