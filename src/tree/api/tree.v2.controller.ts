import { Controller, Get, Param, UsePipes, ValidationPipe, Post, Body, Put, BadRequestException, Delete, ParseUUIDPipe, UseGuards, Patch, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { TreeService } from '../services/tree.service';
import { NodeService } from '../services/node.service';
import { GetAllTreesResponseDto, GetRootTreeResponseDto, GetSubTreeResponseDto, GetAllNodeResponseDto, GetNodeResponseDto } from './dto/get.response';
import { CreateNodeRequest, CreateRootRequest } from '../services/requests/create.request';
import { UpdateNodeParentRequest, UpdateNodeRequest } from '../services/requests/update.request';
import { TreeHasCycleError } from '../domain/tree.model';
import { AdminGuard, AppUserGuard } from 'src/auth/middle/user.guard';
import { TreeMapper, NodeMapper } from './dto/get.mapper';
import { ValidateObject } from 'src/utils/validate.throw';
import { NodeNotFoundError } from '../services/errors.service';
import { NotFoundError } from 'rxjs';
import { plainToClass } from 'class-transformer';


@Controller(
    {
        path: 'trees',
        version: '2'
    }
)
export class TreeControllerV2 {
    constructor(
        private readonly treeService: TreeService,
        private readonly nodeService: NodeService
    ) {}

    @Get('nodes')
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Get all nodes' })
    @ApiResponse({ status: 200, description: 'Nodes found', type: GetAllNodeResponseDto })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    async getAllNodes(): Promise<GetAllNodeResponseDto> {
        const nodes = await this.nodeService.getAllNodes();
        return {nodes: nodes.map(node => NodeMapper.toDto(node))};
    }

    @Post('nodes')
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Create node' })
    @ApiResponse({ status: 201, description: 'Node created' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: CreateNodeRequest })
    async createNode(@Body() req : CreateNodeRequest) {
        await this.treeService.createNode(req);
    }

    @Get('nodes/:id')
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Get node by id' })
    @ApiResponse({ status: 200, description: 'Node found', type: GetNodeResponseDto })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Node not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Node id' })
    async getNode(@Param('id', new ParseUUIDPipe({ version: '4' })) nodeId: string): Promise<GetNodeResponseDto> {
        try {
            const node = await this.nodeService.getNode(nodeId);
            return {node: NodeMapper.toDto(node)};
        } catch (e) {
            if (e instanceof NodeNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Patch('nodes/:id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Update node' })
    @ApiResponse({ status: 200, description: 'Node updated' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Node not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Node id' })
    @ApiBody({ type: UpdateNodeRequest })
    async updateNode(@Param('id', new ParseUUIDPipe({ version: '4' })) nodeId: string, @Body() req: UpdateNodeRequest): Promise<void> {
        req.id = nodeId;
        const request = plainToClass(UpdateNodeRequest, req);
        try {
            ValidateObject(request);
        } catch (e) {
            throw new BadRequestException(e);
        }
        try {
            await this.treeService.updateNode(req);
        } catch (e) {
            if (e instanceof NodeNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete('nodes/:id')
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Delete node with its children going up the tree' })
    @ApiResponse({ status: 200, description: 'Node deleted' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Node not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Node id' })
    async deleteNode(@Param('id', new ParseUUIDPipe({ version: '4' })) id : string) {
        try {
            await this.treeService.deleteNode(id);
        } catch (e) {
            if (e instanceof NodeNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Get("root")
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Get all trees' })
    @ApiResponse({ status: 200, description: 'Trees found', type: GetAllTreesResponseDto })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    async getAllTrees(): Promise<GetAllTreesResponseDto> {
        const trees = await this.treeService.getAllTrees();
        return {trees: trees.map(tree => TreeMapper.toDto(tree))};
    }

    @Post('root')
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Create root' })
    @ApiResponse({ status: 201, description: 'Root created' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: CreateRootRequest })
    async createRoot(@Body() req : CreateRootRequest) {
        await this.treeService.createRoot(req);
    }

    @Get('root/:id')
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Get root tree' })
    @ApiResponse({ status: 200, description: 'Root tree found', type: GetRootTreeResponseDto })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Root tree not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Node id' })
    async getRootTree(@Param('id', new ParseUUIDPipe({ version: '4' })) id : string) : Promise<GetRootTreeResponseDto> {
        try {
            const tree = await this.treeService.getRootTree(id);
            return {tree: TreeMapper.toDto(tree)};
        } catch (e) {
            if (e instanceof NodeNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Get('sub/:id')
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Get subtree' })
    @ApiResponse({ status: 200, description: 'Subtree found', type: GetSubTreeResponseDto })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Subtree not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Node id' })
    async getSubTree(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<GetSubTreeResponseDto> {
        try {
            const tree = await this.treeService.getSubTree(id);
            return { tree: TreeMapper.toDto(tree) };
        } catch (e) {
            if (e instanceof NodeNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete('root/:id')
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Delete root' })
    @ApiResponse({ status: 200, description: 'Root deleted' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Root not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Node id' })
    async deleteRoot(@Param('id', new ParseUUIDPipe({ version: '4' })) id : string) {
        try {
            await this.treeService.deleteRoot(id);
        } catch (e) {
            if (e instanceof NodeNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }
}