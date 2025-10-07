import { Controller, UsePipes, ValidationPipe, Param, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ParsingJobManager } from '../services/job.manager';
import { EnqueueFileRequest } from '../services/requests/enqueue.request';
import { PlannerGuard } from 'src/auth/middle/user.guard';


@Controller({
    path: 'parsing',
    version: '2'
})
export class ParsingControllerV2 {
    constructor(private readonly jobManager: ParsingJobManager) {}

    @Put("enqueue/:fileId")
    @UseGuards(PlannerGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Enqueue file for parsing' })
    @ApiParam({ name: 'fileId', type: String, description: 'File id' })
    @ApiResponse({ status: 200, description: 'File enqueued' })
    async enqueueFile(@Param() req: EnqueueFileRequest) {
        await this.jobManager.enqueue(req.fileId);
    }
}