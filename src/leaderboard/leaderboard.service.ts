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
  ): Promise<
    { username: string; connectionCount: number; profilePicture: string }[]
  > {
    const skip = (page - 1) * limit;

    const leaderboard = await this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoin('connection.user', 'user') // leftJoinAndSelect 대신 leftJoin 사용
      .select([
        'user.username as username',
        'user.current_profile_picture as profilePicture',
        'COUNT(connection.id) as connectionCount',
      ])
      .groupBy('user.id, user.username, user.current_profile_picture') // groupBy 수정
      .orderBy('connectionCount', sortOrder)
      .skip(skip)
      .take(limit)
      .getRawMany();

    return leaderboard.map((entry) => ({
      username: entry.username,
      connectionCount: parseInt(entry.connectionCount, 10),
      profilePicture: entry.profilePicture,
    }));
  }
}
