import { Controller, Get, Post, Body } from '@nestjs/common';
import { NodeService } from '../services/node.service';
import { NodeResponseDto } from './responses/node-response.dto';
import { CreateNodeRequest } from './requests/create.request';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async getAllNodes(): Promise<NodeResponseDto[]> {
    return await this.nodeService.getAllNodes();
  }

  @Post()
  async createNode(@Body() createNodeRequest: CreateNodeRequest) {
    await this.nodeService.createNode(createNodeRequest.title, createNodeRequest.parentId);
  }
}