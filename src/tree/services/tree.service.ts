import { Injectable } from '@nestjs/common';
import { TreeRepository } from '../infra/tree.repository';
import { Tree } from '../domain/tree.model';
import { GetTreeRequest } from './requests/get.request';
import { CreateNodeRequest, CreateRootRequest } from './requests/create.request';
import { UpdateNodeParentRequest } from './requests/update.request';
import { TreeHasCycleError } from '../domain/tree.model';


@Injectable()
export class TreeService {
  constructor(private readonly treeRepository: TreeRepository) {}

  async getSubTree(req: GetTreeRequest): Promise<Tree> {
    return this.treeRepository.getTreeAsRoot(req.id);
  }

  async getRootTree(req: GetTreeRequest): Promise<Tree> {
    return this.treeRepository.getTreeAsPart(req.id);
  }

  async getAllTrees(): Promise<Tree[]> {
    return this.treeRepository.getAllTrees();
  }

  async createNode(req: CreateNodeRequest): Promise<Tree> {
    return this.treeRepository.createNode(req.title, req.parentId);
  }

  async createRoot(req: CreateRootRequest): Promise<Tree> {
    return this.treeRepository.createNode(req.title, null);
  }

  async updateNode(req: UpdateNodeParentRequest): Promise<void> {
    await this.treeRepository.updateNodeAsRoot(req.id, tree => {
      // Need to check for no cycle after changing parent
      // Cycle in tree may appear, if we set node's parent to itself or one of its children
      if (tree.find(child => child.id === req.parentId)) {
        throw new TreeHasCycleError();
      }

      return this.treeRepository.getTreeAsRoot(req.parentId).then(parent => tree.parent = parent);
    })

  }

}