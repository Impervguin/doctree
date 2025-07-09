import { Injectable } from "@nestjs/common";
import { MetaInfoRepository } from "../infra/meta.repository";
import { FileRepository } from "../infra/file.repository";
import { ConfigService } from '@nestjs/config';
import { BufferedFile } from "../domain/bufferedfile.domain";


@Injectable()
export class UploadFileService {
  	constructor(meta: MetaInfoRepository,
				private readonly fileRep: FileRepository,
				private readonly configService: ConfigService
	) {}

	async uploadFile(file : BufferedFile): Promise<string> {
		const bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');

		await this.fileRep.putObject(bucketName, file);

		// здесь потом идшник
		return file.filename;
	}

	async getFileUrl(objectName: string): Promise<string> {
		const bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');
		return this.fileRep.getUrl(bucketName, objectName);
	}
}

