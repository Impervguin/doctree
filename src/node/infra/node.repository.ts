import { DataSource } from 'typeorm';
import { NodeEntity } from './node.entity';
import { Injectable } from '@nestjs/common';
import { Node } from '../domain/node.model';
import { NodeMapper } from './node.mapper';


@Injectable()
export class NodeRepository {
  constructor(private dataSource: DataSource) {}

  async getAllNodes(): Promise<Node[]> {
    return NodeMapper.toDomainArrayPromise(this.dataSource.getRepository(NodeEntity).find());
  }

  async createNode(node: Node): Promise<any> {
    const entity = NodeMapper.toEntity(node);
    return this.dataSource.getRepository(NodeEntity).insert(entity);
  }
}