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

  // async createNode(node: Node): Promise<any> {
  //   const entity = NodeMapper.toEntity(node);
  //   return this.dataSource.getRepository(NodeEntity).insert(entity);
  // }

  async getNode(nodeId: string): Promise<Node | null> {
    return this.dataSource.getRepository(NodeEntity).findOneBy({ id: nodeId }).then(entity => entity ? NodeMapper.toDomain(entity) : null);
  }

  // async updateNode(node: Node): Promise<Node> {
  //   const entity = NodeMapper.toEntity(node);
  //   return this.dataSource.getRepository(NodeEntity).save(entity).then(entity => NodeMapper.toDomain(entity));
  // }
}