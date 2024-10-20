import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@app/common';
import { typeORMConfig } from '@app/common/database/db/typeorm.config';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { BadgeEntity } from '@app/common/database/entities/badge.entity';
import { UserModule } from './user/user.module';
import { ConnectModule } from './connect/connect.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(typeORMConfig),
    TypeOrmModule.forFeature([UserEntity, BadgeEntity]),
    UserModule,
    ConnectModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
