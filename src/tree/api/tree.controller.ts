import { Controller, Get, Param, UsePipes, ValidationPipe, Post, Body, Put, BadRequestException } from '@nestjs/common';
import { TreeService } from '../services/tree.service';
import { GetTreeRequest } from '../services/requests/get.request';
import { GetAllTreesResponseDto } from '../services/responses/get.response';
import { CreateNodeRequest, CreateRootRequest } from '../services/requests/create.request';
import { UpdateNodeParentRequest } from '../services/requests/update.request';
import { TreeHasCycleError } from '../domain/tree.model';


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

  @Post('node')
  @UsePipes(new ValidationPipe())
  async createNode(@Body() req : CreateNodeRequest) {
    await this.treeService.createNode(req);
  }

  @Post('root')
  @UsePipes(new ValidationPipe())
  async createRoot(@Body() req : CreateRootRequest) {
    await this.treeService.createRoot(req);
  }

  @Put('parent')
  @UsePipes(new ValidationPipe())
  async updateNode(@Body() req : UpdateNodeParentRequest) {
    try {
      await this.treeService.updateNode(req);
    } catch (e) {
      if (e instanceof TreeHasCycleError) {
        throw new BadRequestException(e);
      }
      throw e;
    }
  }
}