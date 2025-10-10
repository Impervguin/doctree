import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { TwoFaSender } from "./abstract.service";
import { AppUser } from "src/auth/domain/user.model";


@Injectable()
export class MailSender extends TwoFaSender {
    constructor(private readonly mailService: MailerService) {
        super();
    }
    async send(user: AppUser, code: string): Promise<void> {
        await this.mailService.sendMail({
            to: user.email,
            subject: 'Doctree 2FA',
            text: code,
        });
    }

    async sendResetPassword(user: AppUser, code: string): Promise<void> {
        await this.mailService.sendMail({
            to: user.email,
            subject: 'Doctree Reset Password',
            text: code,
        });
    }
}