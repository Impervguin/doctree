import { NodeEntity } from './node.entity'
import { Node } from '../domain/node.model';

export class NodeMapper {

  static toDomain(entity: NodeEntity): Node {
    return new Node(
      entity.title,
      entity.parentId,
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt
    );
  }

  static toDomainArrayPromise(entities: Promise<NodeEntity[]>): Promise<Node[]> {
    return entities.then(entities => entities.map(NodeMapper.toDomain));
  }
}