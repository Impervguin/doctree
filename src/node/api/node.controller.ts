import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Param, Put } from '@nestjs/common';
import { NodeService } from '../services/node.service';
import { GetAllNodeResponseDto, GetNodeResponseDto } from '../services/responses/get.response';
import { GetNodeRequest } from '../services/requests/get.request';
import { UpdateNodeTitleRequest } from '../services/requests/update.request';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async getAllNodes(): Promise<GetAllNodeResponseDto> {
    return await this.nodeService.getAllNodes();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getNode(@Param() req: GetNodeRequest): Promise<GetNodeResponseDto> {
    return await this.nodeService.getNode(req);
  }

  @Put('title')
  @UsePipes(new ValidationPipe())
  async updateNodeTitle(@Body() req: UpdateNodeTitleRequest) : Promise<void> {
    await this.nodeService.updateNodeTitle(req);
  }


}