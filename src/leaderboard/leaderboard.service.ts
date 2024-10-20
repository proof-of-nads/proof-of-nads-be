import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getConnectionLeaderboard(
    page: number = 1,
    limit: number = 100,
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{ username: string; connectionCount: number }[]> {
    const skip = (page - 1) * limit;

    const leaderboard = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.first_degree_connections', 'connections')
      .select(['user.username', 'COUNT(connections.id) as connectionCount'])
      .groupBy('user.id')
      .orderBy('connectionCount', sortOrder)
      .skip(skip)
      .take(limit)
      .getRawMany();

    return leaderboard.map((entry) => ({
      username: entry.user_username,
      connectionCount: parseInt(entry.connectionCount, 10),
    }));
  }
}
