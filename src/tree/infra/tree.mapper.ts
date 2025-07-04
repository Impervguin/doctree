import { TreeEntity } from "./tree.entity";
import { Tree } from "../domain/tree.model";

export class TreeMapper {
    static toDomain(treeEntity: TreeEntity): Tree {
        let children = treeEntity.children.map(child => TreeMapper.toDomain(child));
        return new Tree(treeEntity.title, treeEntity.id, treeEntity.createdAt, treeEntity.updatedAt, treeEntity.deletedAt, children);
    }
}