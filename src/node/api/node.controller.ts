import { Controller, Get } from '@nestjs/common';
import { NodeService } from '../app/node.service';
import { NodeResponseDto } from './responses/node-response.dto';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async getAllNodes(): Promise<NodeResponseDto[]> {
    return await this.nodeService.getAllNodes();
  }
}