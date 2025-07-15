import { IsBoolean, IsDefined, IsEnum, IsString, IsUUID } from "class-validator";
import { BufferedFile } from "src/file/domain/bufferedfile.domain";
import { DocumentRelationType } from "../../domain/doc.model";


export class DocumentFileLinkRequest {

    @IsUUID('4')
    documentId: string;

    @IsDefined()
    file: BufferedFile;
}

export class DocumentUnlinkFileRequest {
    @IsUUID('4')
    documentId: string;

    @IsUUID('4')
    fileId: string;
}


export class AttachDocumentToNodeRequest {
    @IsUUID('4')
    documentId: string;

    @IsUUID('4')
    nodeId: string;

    @IsBoolean()
    move: boolean;
}

export class DetachDocumentFromNodeRequest {
    @IsUUID('4')
    documentId: string;

    @IsUUID('4')
    nodeId: string;
}

export class RelateDocumentsRequest {
    @IsUUID('4')
    documentId0: string;

    @IsUUID('4')
    documentId1: string;

    @IsEnum(DocumentRelationType)
    relation: DocumentRelationType;
}

export class UnrelateDocumentsRequest {
    @IsUUID('4')
    documentId0: string;

    @IsUUID('4')
    documentId1: string;

    @IsEnum(DocumentRelationType)
    relation: DocumentRelationType;
}