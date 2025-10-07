import { Injectable } from '@nestjs/common';
import { NodeRepository } from '../infra/node.interface';
import { Node } from '../domain/node.model';

import { UpdateNodeTitleRequest } from './requests/update.request';
import { NodeNotFoundError } from './errors.service';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
  ) {}

  async getAllNodes(): Promise<Node[]> {
    return this.nodeRepository.getAllNodes();
  }

  async getNode(nodeId: string): Promise<Node> {
    const node = await this.nodeRepository.getNode(nodeId);
    if (node === null) {
      throw new NodeNotFoundError('Node not found');
    }
    return node;
  }

  async updateNodeTitle(req: UpdateNodeTitleRequest): Promise<void> {
    await this.nodeRepository.updateNodeTitle(req.id, req.title);
  }

  async getNodesBatch(nodeIds: string[]): Promise<Node[]> {
    return this.nodeRepository.getNodesBatch(nodeIds);
  }
}