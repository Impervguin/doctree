import { ParseFileResponse } from "src/text-parser/services/responses/parse.response";

export abstract class ParsedFileRepo {
    abstract save(file: ParseFileResponse): Promise<void>;
}