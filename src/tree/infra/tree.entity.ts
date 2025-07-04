import { Entity, Column, Tree, TreeChildren, TreeParent, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base/base.entity';


@Entity('nodes')
@Tree("closure-table", {
  closureTableName: "node",
  ancestorColumnName: (column) => "ancestor_" + column.propertyName,
  descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class TreeEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @TreeChildren()
  children: TreeEntity[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: TreeEntity | null;
}

