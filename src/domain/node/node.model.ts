import { BaseModel } from '../base.model';

export class Node extends BaseModel {
  title: string;
  nodeId: string | null;
}