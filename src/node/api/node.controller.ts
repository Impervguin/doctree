import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Param, Put } from '@nestjs/common';
import { NodeService } from '../services/node.service';
import { GetAllNodeResponseDto, GetNodeResponseDto } from '../services/responses/get.response';
import { CreateNodeRequest } from '../services/requests/create.request';
import { GetNodeRequest } from '../services/requests/get.request';

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

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getNode(@Param() req: GetNodeRequest): Promise<GetNodeResponseDto> {
    return await this.nodeService.getNode(req);
  }

  // @Put(':id')
  // @UsePipes(new ValidationPipe())
  // async updateNode(@Param() req: GetNodeRequest, @Body() createNodeRequest: CreateNodeRequest) {
  //   await this.nodeService.updateNode(req, createNodeRequest);
  // }
}