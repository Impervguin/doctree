import { Controller, Get, Post, UploadedFile, UseInterceptors, UsePipes} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestService } from '../services/test.service';
import { UploadFileService } from '../services/upload.service';
import { FileValidationPipe } from '../pipes/validate.pipe';

@Controller('test')
export class TestController {

    constructor(private testService: TestService,
                private uploadService: UploadFileService) {}
    
    @Get("list")
    async listBuckets(): Promise<string[]> {
        return this.testService.listBuckets();
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
        const objectName = await this.uploadService.uploadFile({
            filename: file.originalname,
            buffer: file.buffer,
            size: file.size,
        });
        const url = await this.uploadService.getFileUrl(objectName);
        return {
        objectName,
        url,
        };
    }
}