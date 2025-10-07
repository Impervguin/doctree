import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ParsedFileEntity } from "./parsedfile.entity";
import { ParseFileResponse } from "../../text-parser/services/responses/parse.response";
import { ParsedFileMapper } from "./parsedfile.mapper";
import { ParsedFileRepo } from "./parsedfile.interface";


@Injectable()
export class PostgresParsedFileRepo implements ParsedFileRepo {
    constructor(private dataSource: DataSource) {}

    async save(file: ParseFileResponse): Promise<void> {
        let repo = this.dataSource.getRepository(ParsedFileEntity);

        return new Promise((resolve, reject) => {
            repo.save(ParsedFileMapper.toEntity(file)).then(_ => resolve()).catch(reject);
        });
    }

}