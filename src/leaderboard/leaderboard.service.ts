import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { ConnectionEntity } from '@app/common/database/entities/connection.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,
  ) {}

  async getConnectionLeaderboard(
    page: number = 1,
    limit: number = 100,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ username: string; connectionCount: number }[]> {
    const skip = (page - 1) * limit;

    const leaderboard = await this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoinAndSelect('connection.user', 'user')
      .select([
        'user.username',
        'user.current_profile_picture',
        ,
        'COUNT(connection.id) as connectionCount',
      ])
      .groupBy('user.id')
      .orderBy('connectionCount', sortOrder)
      .skip(skip)
      .take(limit)
      .getRawMany();

    return leaderboard.map((entry) => ({
      username: entry.user_username,
      connectionCount: parseInt(entry.connectionCount, 10),
      profilePicture: entry.user_current_profile_picture
    }));
  }
}
