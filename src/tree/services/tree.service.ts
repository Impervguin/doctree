import { Injectable } from '@nestjs/common';
import { TreeRepository } from '../infra/tree.repository';
import { Tree } from '../domain/tree.model';
import { CreateNodeRequest, CreateRootRequest } from './requests/create.request';
import { UpdateNodeParentRequest } from './requests/update.request';
import { TreeHasCycleError } from '../domain/tree.model';
import { DeleteNodeRequest, DeleteRootRequest } from './requests/delete.request';


@Injectable()
export class TreeService {
  constructor(private readonly treeRepository: TreeRepository) {}

  async getSubTree(id: string): Promise<Tree> {
    return this.treeRepository.getTreeAsRoot(id);
  }

  async getRootTree(id: string): Promise<Tree> {
    return this.treeRepository.getTreeAsPart(id);
  }

  async getAllTrees(): Promise<Tree[]> {
    return this.treeRepository.getAllTrees();
  }

  async createNode(req: CreateNodeRequest): Promise<Tree> {
    let node = new Tree(req.title);
    return this.treeRepository.createNode(node, req.parentId);
  }

  async createRoot(req: CreateRootRequest): Promise<Tree> {
    let node = new Tree(req.title);
    return this.treeRepository.createNode(node, null);
  }

  async updateNode(req: UpdateNodeParentRequest): Promise<void> {
    await this.treeRepository.updateNodeAsRoot(req.id, tree => {
      // Need to check for no cycle after changing parent
      // Cycle in tree may appear, if we set node's parent to itself or one of its children
      if (tree.find(child => child.id === req.parentId)) {
        throw new TreeHasCycleError();
      }

      return this.treeRepository.getTreeAsRoot(req.parentId).then(parent => {
        parent.addChild(tree);
        return parent;
      });
    })
  }

  async deleteNode(req: DeleteNodeRequest): Promise<void> {
    await this.treeRepository.updateNodeAsPart(req.id, tree => {
      if (tree.id === req.id) {
        throw new Error('Node is Root');
      }
      tree.deleteChild(req.id);
      return Promise.resolve(tree);
    });
    await this.treeRepository.deleteNode(req.id);
  }

  async deleteRoot(req: DeleteRootRequest): Promise<void> {
      let isRoot = await this.treeRepository.isRootNode(req.id);
      if (!isRoot) {
        throw new Error('Node is not root');
      }
      this.treeRepository.deleteNodeCascade(req.id);
  }
}