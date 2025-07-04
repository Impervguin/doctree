import { Tree } from '../../domain/tree.model';

export type GetAllTreesResponseDto = Pick<Tree, 'id' | 'title' | 'children' | 'createdAt' | 'updatedAt' | 'deletedAt'>[];