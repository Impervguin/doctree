import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@doctree/shared/base';

@Entity('nodes')
export class NodeEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'parent_id', nullable: true, type: String })
  parentId: string | null;
}