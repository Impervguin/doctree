import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TreeService } from '../services/tree.service';
import { GetSubTreeRequest } from '../services/requests/get.request';


@Controller('trees')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  // @Get(':id')
  // @UsePipes(new ValidationPipe())
  // async getSubTree(@Param() req : GetSubTreeRequest) {
  //   return await this.treeService.getSubTree(req);
  // }
}