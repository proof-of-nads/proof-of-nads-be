import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { ConnectionEntity } from '@app/common/database/entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ConnectionEntity])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
