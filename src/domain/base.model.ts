export abstract class BaseModel {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}