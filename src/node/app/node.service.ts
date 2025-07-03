import { Injectable } from '@nestjs/common';
import { NodeRepository } from '../infra/node.repository';
import { Node } from '../domain/node.model';
import { NodeMapper } from '../infra/node.mapper';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
  ) {}

  async getAllNodes(): Promise<Node[]> {
    return this.nodeRepository.getAllNodes();
  }
}