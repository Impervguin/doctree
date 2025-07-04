import { Entity, Column, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../database/base/base.entity';

@Entity('nodes')
@Tree('closure-table')
export class TreeEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @TreeChildren()
  children: TreeEntity[];
}