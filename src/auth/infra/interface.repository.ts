import { Planner } from "../domain/planner.model";
import { AppUser, User } from "../domain/user.model";
import { Admin } from "../domain/admin.model";

export abstract class AuthRepository {
    abstract getUser(username: string): Promise<User | null>;
    abstract getUserById(id: string): Promise<User | null>;
    abstract createPlanner(planner: Planner): Promise<void>;
    abstract createUser(user: AppUser): Promise<void>;
}