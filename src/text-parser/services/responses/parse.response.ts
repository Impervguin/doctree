

export class ParseFileResponse {
    fileId: string;
    text: string;
    mimeType: string;

    parsePercentage: number;
    parseComment?: string;
}