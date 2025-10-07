import { Tree } from '../../domain/tree.model';
import { TreeDto } from './get.response';
import { Node } from '../../domain/node.model';
import { NodeDto } from './get.response';

export class TreeMapper {
    static toDto(tree: Tree): TreeDto {
        let children: TreeDto[] = [];
        tree.forEachFlat(child => {
            children.push(TreeMapper.toDto(child));
        });
        return {
            id: tree.id,
            title: tree.title,
            children: children,
        };
    }
}

export class NodeMapper {
    static toDto(node: Node): NodeDto {
        return {
            id: node.id,
            title: node.title,
            parentId: node.parentId,
        };
    }
}