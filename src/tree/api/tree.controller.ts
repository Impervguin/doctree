import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TreeService } from '../services/tree.service';
import { GetSubTreeRequest } from '../services/requests/get.request';
import { GetAllTreesResponseDto } from '../services/responses/get.response';


@Controller('trees')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  // @Get(':id')
  // @UsePipes(new ValidationPipe())
  // async getSubTree(@Param() req : GetSubTreeRequest) {
  //   return await this.treeService.getSubTree(req);
  // }

  @Get()
  async getAllTrees(): Promise<GetAllTreesResponseDto> {
    return this.treeService.getAllTrees();
  }

}