import { BaseModel } from '../base.model';

export class Node extends BaseModel {
  title: string;
  parentId: string | null;
  children?: Node[];
}