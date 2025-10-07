import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { DatabaseStringService } from "src/database/db/database.string";
import { ParsingController } from "./api/jobs.controller";
import { FileQueueRepo } from "./infra/queue.interface";
import { ParsingJobManager } from "./services/job.manager";
import { ParsedFileRepo } from "./infra/parsedfile.interface";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParsedFileEntity } from "./infra/parsedfile.entity";
import { ParsingControllerV2 } from "./api/jobs.v2.controller";
import { PgBossFileQueueRepo } from "./infra/queue.repo";
import { PostgresParsedFileRepo } from "./infra/parsedfile.repo";
import { AuthModule } from "src/auth/auth.module";



@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([ParsedFileEntity]), AuthModule],
    providers: [{
        provide: 'PG_BOSS',
        useFactory: async (strService : DatabaseStringService) => {
            const PgBoss = require('pg-boss');
            const boss = new PgBoss({
                connectionString: strService.getString(),
                max: 1,
            })
            await boss.start();
            return boss;
        },
        inject: [DatabaseStringService],
    },
    ParsingJobManager,
    {
        provide: FileQueueRepo,
        useClass: PgBossFileQueueRepo,
    },
    {
        provide: ParsedFileRepo,
        useClass: PostgresParsedFileRepo,
    },
    ],
    controllers: [ParsingController, ParsingControllerV2],
})
export class ParsingJobModule {}