import { Tree } from "../domain/tree.model";

export abstract class TreeRepository {
    abstract getAllTrees(): Promise<Tree[]>;
    abstract getTreeAsRoot(id: string): Promise<Tree>;
    abstract getTreeAsPart(id: string): Promise<Tree>;
    abstract createNode(node: Tree, parentId: string | null): Promise<Tree>;
    abstract updateNodeAsRoot(id: string, updatefn: (tree: Tree) => Promise<Tree>): Promise<Tree>;
    abstract updateNodeAsPart(id: string, updatefn: (tree: Tree) => Promise<Tree>): Promise<Tree>;
    abstract updateTree(tree: Tree, updatefn: (tree: Tree) => Promise<Tree>): Promise<Tree>;
    abstract isRootNode(id: string): Promise<boolean>;
    abstract deleteNodeCascade(id: string): Promise<void>;
    abstract deleteNode(id: string): Promise<void>;
}