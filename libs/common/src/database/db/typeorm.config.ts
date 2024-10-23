import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import configure from "../../configure/configure";
import * as path from 'path';
import { UserEntity } from "../entities/user.entity";

const config = configure();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: config.HOST || 'db',
    port: config.DBPORT || 3306,
    username: config.DB_USERNAME || 'user',
    password: config.DB_PASSWORD || 'password',
    database: config.DB_DATABASE || 'my_database',
    entities: [path.join(__dirname, '../entities/**/*.entity{.ts,.js}'), UserEntity],
    // synchronize: process.env.NODE_ENV !== 'production',
    synchronize: true,
    logging: true,
    logger: 'file',
}