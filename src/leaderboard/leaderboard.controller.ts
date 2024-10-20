import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('connections')
  getConnectionLeaderboard() {
    return this.leaderboardService.getConnectionLeaderboard();
  }
}