import { Parser, ParserResponse } from "../parser.interface";
import { Buffer } from "buffer";
import { RegisterParser } from "../registry/parser.decorator";


@RegisterParser('test1')
export class Test1Parser implements Parser {
    supports(fileType: string): boolean {
        return fileType === 'test1';
    }

    parse(file: Buffer): Promise<ParserResponse> {
        return Promise.resolve({
            text: 'test1',
            mimeType: 'text/plain',
            parsePercentage: 100,
        });
    }
}