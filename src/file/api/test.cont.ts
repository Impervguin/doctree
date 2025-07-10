import { Controller, Delete, Get, Post, UploadedFile, UseInterceptors, Param} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from '../services/upload.service';
import { FileValidationPipe } from '../pipes/validate.pipe';

@Controller('test')
export class TestController {

    constructor(private uploadService: UploadFileService) {}
    
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
        const obj = await this.uploadService.uploadFile({
            filebucket: "test",
            filedir: "test",
            file: {
                filename: file.originalname,
                buffer: file.buffer,
                size: file.size,
            },
        });
        return obj;
    }

    @Delete(':fileId')
    async deleteFile(@Param('fileId') fileId: string) {
        await this.uploadService.deleteFile(fileId);
    }
}
