import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TreeEntity } from "./tree.entity";
import { Tree } from "../domain/tree.model";
import { TreeMapper } from "./tree.mapper";


@Injectable()
export class TreeRepository {
    constructor(private dataSource: DataSource) {}
}


