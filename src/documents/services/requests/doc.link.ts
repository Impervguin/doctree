import { IsDefined, IsUUID } from "class-validator";
import { BufferedFile } from "src/file/domain/bufferedfile.domain";


export class DocumentFileLinkRequest {

    @IsUUID('4')
    documentId: string;

    @IsDefined()
    file: BufferedFile;
}