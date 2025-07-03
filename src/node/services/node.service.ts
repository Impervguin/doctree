import { Injectable } from '@nestjs/common';
import { NodeRepository } from '../infra/node.repository';
import { Node } from '../domain/node.model';
import { CreateNodeRequest } from './requests/create.request';
import { GetAllNodeResponseDto, GetNodeResponseDto } from './responses/get.response';
import { IsUUID } from 'class-validator';
import { GetNodeRequest } from './requests/get.request';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
  ) {}

  async getAllNodes(): Promise<GetAllNodeResponseDto> {
    return this.nodeRepository.getAllNodes();
  }

  async createNode(createNodeRequest: CreateNodeRequest): Promise<Node> {
    const node = new Node(createNodeRequest.title, createNodeRequest.parentId);
    await this.nodeRepository.createNode(node);
    return node;
  }

  async getNode(req: GetNodeRequest): Promise<GetNodeResponseDto> {
    const node = await this.nodeRepository.getNode(req.id);
    if (node === null) {
      throw new NodeNotFoundError('Node not found');
    }
    return node;
  }
}