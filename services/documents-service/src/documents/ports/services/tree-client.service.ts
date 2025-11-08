import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { GetRootTreeResponse, GetNodeResponse } from '../dto/tree-client.dto';
import { Tree } from 'src/documents/domain/tree.model';
import { deserializeDate } from '@doctree/shared/utils/date';
import { Node } from 'src/documents/domain/doc.model';

export interface TreeReadServiceGrpc {
  GetRootTree(data: { nodeId: string }): Observable<GetRootTreeResponse>;
  GetNode(data: { nodeId: string }): Observable<GetNodeResponse>;
}

@Injectable()
export class TreeClient {
  constructor(@Inject('TREE_READ_SERVICE') private client: ClientGrpc) {}

  private get treeService(): TreeReadServiceGrpc {
    return this.client.getService<TreeReadServiceGrpc>('TreeReadService');
  }

  private transformTree(resp: GetRootTreeResponse): Tree {
    if (!resp.children || resp.children.length === 0) {
      return new Tree(resp.title, [], resp.id, deserializeDate(resp.createdAt), deserializeDate(resp.updatedAt), resp.deletedAt ? deserializeDate(resp.deletedAt) : null);
    }
    const children = resp.children.map(child => this.transformTree(child));
    return new Tree(resp.title, children, resp.id, new Date(resp.createdAt), new Date(resp.updatedAt), resp.deletedAt ? new Date(resp.deletedAt) : null);
  }

  async getRootTree(nodeId: string): Promise<Tree> {
    const res = await firstValueFrom(this.treeService.GetRootTree({ nodeId: nodeId })) as GetRootTreeResponse;
    return this.transformTree(res);
  }

  async getNode(nodeId: string): Promise<Node> {
    return firstValueFrom(this.treeService.GetNode({ nodeId: nodeId })).then(res => {
      return {
        id: res.id,
        title: res.title,
      };
    });
  }
}