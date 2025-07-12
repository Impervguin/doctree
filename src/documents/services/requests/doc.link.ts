import { IsBoolean, IsDefined, IsUUID } from "class-validator";
import { BufferedFile } from "src/file/domain/bufferedfile.domain";


export class DocumentFileLinkRequest {

    @IsUUID('4')
    documentId: string;

    @IsDefined()
    file: BufferedFile;
}


export class AttachDocumentToNodeRequest {
    @IsUUID('4')
    documentId: string;

    @IsUUID('4')
    nodeId: string;

    @IsBoolean()
    move: boolean;
}