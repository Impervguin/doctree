import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TreeEntity } from "./tree.entity";
import { Tree } from "../domain/tree.model";
import { TreeMapper } from "./tree.mapper";


@Injectable()
export class TreeRepository {
    constructor(private dataSource: DataSource) {}
    async getAllTrees(): Promise<Tree[]> {
        return this.dataSource.getTreeRepository(TreeEntity).findTrees().then(trees => trees.map(TreeMapper.toDomain));
    }

    async getTreeAsRoot(id: string): Promise<Tree> {
        let treeRep = this.dataSource.getTreeRepository(TreeEntity);
        let node = await treeRep.findOneBy({ id: id });
        if (!node) {
            throw new NodeNotFoundError('Node not found');
        }
        return treeRep.findDescendantsTree(node).then(tree => TreeMapper.toDomain(tree));
    }

    async getTreeAsPart(id: string): Promise<Tree> {
        let rep = this.dataSource.getRepository(TreeEntity)

        let root = await rep.createQueryBuilder()
            .where('parent_id is NULL')
            .andWhere(`id IN (
                SELECT DISTINCT ancestor_id
                FROM node_closure
                WHERE descendant_id = :id
            )`, { id: id })
            .getOne();

        if (root == null) {
            throw new Error('Node not found');
        }

        let treeRep = this.dataSource.getTreeRepository(TreeEntity);

        return treeRep.findDescendantsTree(root).then(tree => TreeMapper.toDomain(tree));
    }

    async createNode(title : string, parentId : string | null): Promise<Tree> {
        let treeRep = this.dataSource.getTreeRepository(TreeEntity);
        let node = new TreeEntity();
        node.title = title;
        if (parentId) {
            node.parent = await treeRep.findOneBy({ id: parentId });
        } else {
            node.parent = null;
        }
        return treeRep.save(node).then(node => TreeMapper.toDomain(node));
    }
}

