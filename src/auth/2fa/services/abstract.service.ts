import { AppUser } from "src/auth/domain/user.model";


export abstract class TwoFaSender {
    abstract send(user : AppUser, code: string): Promise<void>;
    abstract sendResetPassword(user: AppUser, code: string): Promise<void>;
}