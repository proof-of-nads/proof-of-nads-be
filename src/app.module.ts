import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@app/common';
import { typeORMConfig } from '@app/common/database/db/typeorm.config';
import { UserModule } from './user/user.module';
import { ConnectModule } from './connect/connect.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    ConnectModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
