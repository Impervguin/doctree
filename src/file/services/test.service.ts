import { Injectable } from "@nestjs/common";
import { MetaInfoRepository } from "../infra/meta.repository";
import { FileRepository } from "../infra/file.repository";

@Injectable()
export class TestService {
    constructor(private meta: MetaInfoRepository, private file: FileRepository) {}

    async listBuckets(): Promise<string[]> {
        return this.file.listBuckets();
    }
    
}