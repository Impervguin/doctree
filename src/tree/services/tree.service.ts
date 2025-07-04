import { Injectable } from '@nestjs/common';
import { TreeRepository } from '../infra/tree.repository';
import { Tree } from '../domain/tree.model';
import { GetSubTreeRequest } from './requests/get.request';


@Injectable()
export class TreeService {
  constructor(private readonly treeRepository: TreeRepository) {}

  // async getSubTree(req: GetSubTreeRequest): Promise<Tree> {
    // return this.treeRepository.getTreeAsRoot(req.id);
  // }

  async getAllTrees(): Promise<Tree[]> {
    return this.treeRepository.getAllTrees();
  }
}