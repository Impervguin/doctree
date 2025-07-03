import { Node } from '../../../node/domain/node.model';

export type NodeResponseDto = Pick<Node, 'id' | 'title' | 'parentId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;