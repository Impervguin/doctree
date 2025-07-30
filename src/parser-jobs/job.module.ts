import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { DatabaseStringService } from "src/database/db/database.string";
import { ParsingController } from "./api/jobs.controller";
import { FileQueueRepo } from "./infra/queue.repo";
import { ParsingJobManager } from "./services/job.manager";



@Module({
    imports: [DatabaseModule],
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
    FileQueueRepo,
    ],
    controllers: [ParsingController],
})
export class ParsingJobModule {}