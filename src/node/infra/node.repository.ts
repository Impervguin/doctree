import { DataSource } from 'typeorm';
import { NodeEntity } from './node.entity';
import { Injectable } from '@nestjs/common';
import { Node } from '../domain/node.model';
import { NodeMapper } from './node.mapper';
import { NotFoundError } from '../../errors/errors';
import { NodeRepository } from './node.interface';


@Injectable()
export class PostgresNodeRepository implements NodeRepository {
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

  async updateNodeTitle(nodeId: string, title: string): Promise<void> {
    const result = await this.dataSource.getRepository(NodeEntity)
      .update({ id: nodeId }, { title: title });
    
    if (result.affected === 0) {
      throw new NotFoundError(`Node with ID ${nodeId} not found`);
    }
  }
}