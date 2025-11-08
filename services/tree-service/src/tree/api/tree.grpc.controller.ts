import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TreeService } from '../services/tree.service';
import { NodeService } from '../services/node.service';
import { GetNodeRequest, GetNodeResponse, GetRootTreeRequest, GetRootTreeResponse } from './dto/grpc.response';
import { Tree } from '../domain/tree.model';
import { serializeDate } from '@doctree/shared/utils/date';
import { GrpcLoggingInterceptor, LoggingInterceptor } from '@doctree/shared/utils/logging.interceptor';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class TreeGrpcController {
  constructor(
    private readonly treeService: TreeService,
    private readonly nodeService: NodeService,
  ) {}

  private serializeTree(tree: Tree): GetRootTreeResponse {
    let children : GetRootTreeResponse[] = [];
    tree.forEachFlat(child => {
      children.push(this.serializeTree(child));
    });
    return {
      id: tree.id,
      title: tree.title,
      children: children,
      createdAt: serializeDate(tree.createdAt),
      updatedAt: serializeDate(tree.updatedAt),
      deletedAt: tree.deletedAt ? serializeDate(tree.deletedAt) : undefined,
    };
  }

  @GrpcMethod('TreeReadService', 'GetRootTree')
  async getRootTree(data: GetRootTreeRequest) : Promise<GetRootTreeResponse> {
    const tree = await this.treeService.getRootTree(data.nodeId);
    return this.serializeTree(tree);
  }

  @GrpcMethod('TreeReadService', 'GetNode')
  async getNode(data: GetNodeRequest) : Promise<GetNodeResponse> {
    const node = await this.nodeService.getNode(data.nodeId);
    return {
      id: node.id,
      title: node.title,
      parentId: node.parentId ? node.parentId : undefined,
      createdAt: serializeDate(node.createdAt),
      updatedAt: serializeDate(node.updatedAt),
      deletedAt: node.deletedAt ? serializeDate(node.deletedAt) : undefined,
    };
  }
}