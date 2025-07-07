import { Controller, Get } from '@nestjs/common';
import { TestService } from '../services/test.service';

@Controller('test')
export class TestController {

    constructor(private testService: TestService) {}
    
    @Get("list")
    async listBuckets(): Promise<string[]> {
        return this.testService.listBuckets();
    }
}