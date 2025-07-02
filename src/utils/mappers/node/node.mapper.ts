import { NodeEntity } from '../../../database/node/node.entity';
import { Node } from '../../../domain/node/node.model';

export class NodeMapper {
  static toDomain(entity: NodeEntity): Node {
    return {
      id: entity.id,
      title: entity.title,
      nodeId: entity.nodeId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}