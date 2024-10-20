import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('connections')
  getConnectionLeaderboard(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.leaderboardService.getConnectionLeaderboard(
      page,
      limit,
      sortOrder,
    );
  }
}
