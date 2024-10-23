import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { ConnectionEntity } from '@app/common/database/entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ConnectionEntity])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
