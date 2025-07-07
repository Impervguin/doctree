import { Controller, Get } from '@nestjs/common';
import { NodeService } from '../../utils/services/node/node.service';
import { NodeResponseDto } from './node-response.dto';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async getAllNodes(): Promise<NodeResponseDto[]> {
    const nodes = await this.nodeService.getAllNodes();
    return nodes.map(node => new NodeResponseDto(node));
  }
}