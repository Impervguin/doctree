import { Node } from '../../../node/domain/node.model';

export class NodeResponseDto implements Pick<Node, 'id' | 'title' | 'nodeId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  id: string;
  title: string;
  nodeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(node: Node) {
    this.id = node.id;
    this.title = node.title;
    this.nodeId = node.nodeId;
    this.createdAt = node.createdAt;
    this.updatedAt = node.updatedAt;
    this.deletedAt = node.deletedAt;
  }
}