
import { Node } from "../domain/node.model";

export abstract class NodeRepository {
    abstract getAllNodes(): Promise<Node[]>;
    abstract getNode(nodeId: string): Promise<Node | null>;
    abstract updateNodeTitle(nodeId: string, title: string): Promise<void>;
}