import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../database/base/base.entity';

@Entity('nodes')
export class NodeEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'node_id', nullable: true })
  nodeId: string;
}