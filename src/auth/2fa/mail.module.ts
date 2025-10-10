import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TwoFaSender } from "./services/abstract.service";
import { MailSender } from "./services/mail.service";


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                console.log(configService.get('AUTH_MAIL_HOST'));
                console.log(configService.get('AUTH_MAIL_USER'));
                console.log(configService.get('AUTH_MAIL_PASSWORD'));
            return {
                transport: {
                    host: configService.get('AUTH_MAIL_HOST'),
                    secure: true,
                    port: 465,
                    auth: {
                        user: configService.get('AUTH_MAIL_USER'),
                        pass: configService.get('AUTH_MAIL_PASSWORD'),
                    },
                },
            }},
            inject: [ConfigService],
            }),
    ],
    providers: [{
        provide: TwoFaSender,
        useClass: MailSender,
    }],
    exports: [TwoFaSender]
})
export class TwoFaModule {}