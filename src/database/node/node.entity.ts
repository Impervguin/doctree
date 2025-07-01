import { Entity, Column, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('nodes')
@Tree('closure-table')
export class NodeEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @TreeChildren()
  children: NodeEntity[];

  @TreeParent()
  parent: NodeEntity;
}