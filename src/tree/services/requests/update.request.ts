import { IsUUID } from "class-validator";

export class UpdateNodeParentRequest {
  @IsUUID()
  id: string;

  @IsUUID()
  parentId: string;
}