import { Injectable } from '@nestjs/common';
import { TreeRepository } from '../infra/tree.repository';
import { Tree } from '../domain/tree.model';
import { GetTreeRequest } from './requests/get.request';


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
}