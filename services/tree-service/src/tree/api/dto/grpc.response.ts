export interface Tree {
    id: string;
    title: string;
    children: Tree[];
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  }
  
  export interface Node {
    id: string;
    title: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  }
  
  export interface GetRootTreeRequest {
    nodeId: string;
  }
  
  export interface GetNodeRequest {
    nodeId: string;
  }
  
  export interface GetRootTreeResponse extends Tree {}
  
  export interface GetNodeResponse extends Node {}
  