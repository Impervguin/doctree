import { DataSource } from 'typeorm';
import { NodeEntity } from './node.entity';

export class NodeRepository {
  constructor(private dataSource: DataSource) {}

  async getAllNodes(): Promise<NodeEntity[]> {
    return this.dataSource.getRepository(NodeEntity)
      .createQueryBuilder('node')
      .getMany();
  }
}