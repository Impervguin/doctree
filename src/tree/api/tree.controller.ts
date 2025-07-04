import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TreeService } from '../services/tree.service';
import { GetTreeRequest } from '../services/requests/get.request';
import { GetAllTreesResponseDto } from '../services/responses/get.response';


@Controller('trees')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Get('sub/:id')
  @UsePipes(new ValidationPipe())
  async getSubTree(@Param() req : GetTreeRequest) {
    return await this.treeService.getSubTree(req);
  }

  @Get('root/:id')
  @UsePipes(new ValidationPipe())
  async getRootTree(@Param() req : GetTreeRequest) {
    return await this.treeService.getRootTree(req);
  }

  @Get()
  async getAllTrees(): Promise<GetAllTreesResponseDto> {
    return this.treeService.getAllTrees();
  }

}