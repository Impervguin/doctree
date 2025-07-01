import { Injectable } from '@nestjs/common';
import { NodeRepository } from '../../../database/node/node.repository';
import { Node } from '../../../domain/node/node.model';
import { NodeMapper } from '../../../utils/mappers/node/node.mapper';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
  ) {}

  async getAllNodes(): Promise<Node[]> {
    const entities = await this.nodeRepository.getAllNodes();
    return entities.map(NodeMapper.toDomain);
  }
}