import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import configure from "../../configure/configure";
import * as path from 'path';
import { UserEntity } from "../entities/user.entity";
import { ConnectionEntity } from "../entities/connection.entity";

const config = configure();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: config.DB_HOST || 'db',
    port: config.DB_PORT || 3306,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    entities: [path.join(__dirname, '../entities/**/*.entity{.ts,.js}'), UserEntity, ConnectionEntity],
    // synchronize: process.env.NODE_ENV !== 'production',
    synchronize: true,
    logging: true,
    logger: 'file',
}