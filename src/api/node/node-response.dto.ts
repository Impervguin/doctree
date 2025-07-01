import { Node } from '../../domain/node/node.model';

export class NodeResponseDto implements Pick<Node, 'id' | 'title' | 'parentId'> {
  id: string;
  title: string;
  parentId: string | null;
  children?: NodeResponseDto[]; // For nested responses

  constructor(node: Node) {
    this.id = node.id;
    this.title = node.title;
    this.parentId = node.parentId;
    this.children = node.children?.map(child => new NodeResponseDto(child));
  }
}