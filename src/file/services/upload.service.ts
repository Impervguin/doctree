import { Injectable } from "@nestjs/common";
import { MetaInfoRepository } from "../infra/meta.repository";
import { FileRepository } from "../infra/file.repository";


@Injectable()
export class UploadFileService {
    constructor(meta: MetaInfoRepository, file: FileRepository) {}

}

