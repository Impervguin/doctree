import { Entity, OneToMany, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { BaseEntity } from "../../database/base/base.entity";
import { FileInfo } from "src/file/infra/info.entity";

@Entity('documents')
export class DocumentEntity extends BaseEntity {
    @Column()
    title: string;

    @Column({ nullable: true, type: String })
    description: string | null;

    @OneToMany(() => DocumentTagEntity, documentTag => documentTag.document, { cascade: true })
    tags: DocumentTagEntity[];

    @OneToMany(() => DocumentFileEntity, documentFile => documentFile.document, { cascade: true })
    documentFiles?: DocumentFileEntity[];

    @OneToMany(() => DocumentNodeEntity, dn => dn.document)
    documentNodes?: DocumentNodeEntity[];
}

@Entity('nodes')
export class NodeEntity extends BaseEntity {
    @Column({ type: 'text' })
    title: string;

    @OneToMany(() => DocumentNodeEntity, dn => dn.node)
    documentNodes: DocumentNodeEntity[];
}

@Entity('documents_tags')
export class DocumentTagEntity {
    @ManyToOne(() => DocumentEntity, document => document.tags)
    @JoinColumn({ name: 'document_id' })
    document: DocumentEntity;

    @PrimaryColumn({ name: 'document_id' })
    documentId: string;

    @PrimaryColumn({ name: 'tag' })
    tag: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date | null;
}

@Entity('documents_files')
export class DocumentFileEntity {
    @ManyToOne(() => DocumentEntity, document => document.documentFiles)
    @JoinColumn({ name: 'document_id' })
    document: DocumentEntity;

    @PrimaryColumn({ name: 'document_id' })
    documentId: string;

    @PrimaryColumn({ name: 'file_id' })
    fileId: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt?: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt?: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt?: Date | null;
}

@Entity('documents_nodes')
export class DocumentNodeEntity {
    @ManyToOne(() => DocumentEntity, document => document.documentNodes)
    @JoinColumn({ name: 'document_id' })
    document: DocumentEntity;

    @ManyToOne(() => NodeEntity, node => node.documentNodes)
    @JoinColumn({ name: 'node_id' })
    node: NodeEntity;

    @PrimaryColumn({ name: 'document_id' })
    documentId: string;

    @PrimaryColumn({ name: 'node_id' })
    nodeId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date | null;
}