import { Node } from '../../domain/node.model';

export class CreateNodeRequest {
    title: string;
    parentId: string | null;

    toDomain(): Node {
        return new Node(this.title, this.parentId);
    }
}