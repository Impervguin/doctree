import { Injectable } from '@nestjs/common';
import { AuthRepository } from './interface.repository';
import { Planner } from '../domain/planner.model';
import { AppUser, User } from '../domain/user.model';
import { Admin } from '../domain/admin.model';
import { DataSource } from 'typeorm';
import { UserEntity, AdminEntity, ParseSchedulerEntity } from './user.entity';
import { UserMapper, AdminMapper, ParseSchedulerMapper } from './user.mapper';

@Injectable()
export class PostgresAuthRepository implements AuthRepository {
    constructor(private dataSource: DataSource) {}
    async getUser(username: string): Promise<User | null> {
        let repo = this.dataSource.getRepository(UserEntity);
        const appUser = await repo.findOne({
            where: { username: username }
        });
        
        if (appUser !== null) {
            const admin = await this.getAdminById(appUser.id);
            return admin ? admin : UserMapper.toDomain(appUser);
        }

        let parseRepo = this.dataSource.getRepository(ParseSchedulerEntity);
        const parseUser = await parseRepo.findOne({
            where: { username: username }
        });
        if (parseUser !== null) {
            return ParseSchedulerMapper.toDomain(parseUser);
        }
        return null;
    }

    async getAdminById(id: string): Promise<Admin | null> {
        let repo = this.dataSource.getRepository(AdminEntity);
        const admin = await repo.findOne({
            where: { id: id },
            relations: ['user']
        });
        if (admin !== null) {
            return AdminMapper.toDomain(admin);
        }
        return null;
    }

    async getUserById(id: string): Promise<User | null> {
        let repo = this.dataSource.getRepository(UserEntity);
        const appUser = await repo.findOne({
            where: { id: id }
        });
        if (appUser !== null) {
            const admin = await this.getAdminById(appUser.id);
            return admin ? admin : UserMapper.toDomain(appUser);
        }

        let parseRepo = this.dataSource.getRepository(ParseSchedulerEntity);
        const parseUser = await parseRepo.findOne({
            where: { id: id }
        });
        if (parseUser !== null) {
            return ParseSchedulerMapper.toDomain(parseUser);
        }
        return null;
    }
    
    async createPlanner(planner: Planner): Promise<void> {
        let repo = this.dataSource.getRepository(ParseSchedulerEntity);
        return new Promise((resolve, reject) => {
            repo.save(ParseSchedulerMapper.toEntity(planner)).then(_ => resolve()).catch(reject);
        });
    }
    async createUser(user: AppUser): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dataSource.getRepository(UserEntity).save(UserMapper.toEntity(user)).then(_ => resolve()).catch(reject);
        });
    }

    async updateUser(user: AppUser): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dataSource.getRepository(UserEntity).save(UserMapper.toEntity(user)).then(_ => resolve()).catch(reject);
        });
    }
}