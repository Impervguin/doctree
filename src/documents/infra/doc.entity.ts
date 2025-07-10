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
}

@Entity('documents_tags')
export class DocumentTagEntity {
    @PrimaryGeneratedColumn()
    id?: string

    @ManyToOne(() => DocumentEntity, document => document.tags)
    @JoinColumn({ name: 'document_id' })
    document: DocumentEntity;

    @Column({ name: 'tag' })
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
    @PrimaryGeneratedColumn()
    id?: string

    @ManyToOne(() => DocumentEntity, document => document.documentFiles)
    @JoinColumn({ name: 'document_id' })
    document: DocumentEntity;

    @Column({ name: 'file_id' })
    fileId: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt?: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt?: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt?: Date | null;
}

