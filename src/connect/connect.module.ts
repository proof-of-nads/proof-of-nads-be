import { Module } from '@nestjs/common';
import { ConnectController } from './connect.controller';
import { ConnectService } from './connect.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { GithubModule } from 'src/github/github.module';
import { ConnectionEntity } from '@app/common/database/entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ConnectionEntity]), GithubModule],
  controllers: [ConnectController],
  providers: [ConnectService],
})
export class ConnectModule {}
