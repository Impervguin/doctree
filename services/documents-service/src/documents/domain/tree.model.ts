
import { BaseModel } from '@doctree/shared/base/base.model';

export class TreeInterface {
    id: string;
    title: string;
    children: TreeInterface[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export class Tree extends BaseModel {
    title: string;
    children: Tree[];
    constructor(title: string, children: TreeInterface[], id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date | null) {
        if (arguments.length <= 2) {
            super();
        } else {
            super(id!, createdAt!, updatedAt!, deletedAt!);
        }
        this.title = title;
        this.children = [];
        for (const child of children) {
            this.children.push(new Tree(child.title, child.children, child.id, child.createdAt, child.updatedAt, child.deletedAt));
        }
    }

    find(nodeFunc: (node: Tree) => boolean): Tree | null {
        if (nodeFunc(this)) {
            return this;
        }
        if (this.children.length === 0) {
            return null;
        }
        for (const child of this.children) {
            const node = child.find(nodeFunc);
            if (node !== null) {
                return node;
            }
        }
        return null;
    }
}

