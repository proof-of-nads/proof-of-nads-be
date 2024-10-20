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

  async getConnectionLeaderboard(): Promise<
    { username: string; connectionCount: number }[]
  > {
    const leaderboard = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.first_degree_connections', 'connections')
      .select(['user.username', 'COUNT(connections.id) as connectionCount'])
      .groupBy('user.id')
      .orderBy('connectionCount', 'DESC')
      .limit(100)
      .getRawMany();

    return leaderboard.map((entry) => ({
      username: entry.user_username,
      connectionCount: parseInt(entry.connectionCount, 10),
    }));
  }
}
