import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';


@Injectable()
export class MetaInfoRepository {
    constructor(private dataSource: DataSource) {}
}