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

  async createNode(title: string, parentId: string | null): Promise<Node> {
    const node = new Node(title, parentId);
    await this.nodeRepository.createNode(node);
    return node;
  }
}