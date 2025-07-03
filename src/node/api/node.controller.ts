import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { NodeService } from '../services/node.service';
import { GetAllNodeResponseDto } from '../services/responses/get.response';
import { CreateNodeRequest } from '../services/requests/create.request';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async getAllNodes(): Promise<GetAllNodeResponseDto> {
    return await this.nodeService.getAllNodes();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createNode(@Body() createNodeRequest: CreateNodeRequest) {
    await this.nodeService.createNode(createNodeRequest);
  }
}