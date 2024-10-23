import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { ConnectionEntity } from '@app/common/database/entities/connection.entity';
import { GithubService } from 'src/github/github.service';
import { ConnectionResponse } from './types/connection.types';




@Injectable()
export class ConnectService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,
    private readonly githubService: GithubService,
  ) {}

  async requestConnections(
    requesterId: string,
    receiverUsernames: string[],
    proofImage: Buffer,
  ): Promise<ConnectionResponse> {
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
      relations: ['connections', 'connections.connected_user'],
    });

    if (!requester) {
      return { success: false, message: 'Requester not found', code: 404 };
    }

    try {
      // Github에 이미지 업로드
      const filename = `proof-${Date.now()}.jpg`;
      const imageUrl = await this.githubService.uploadImage(
        proofImage,
        filename,
      );

      const successfulConnections = [];
      const failedConnections = [];

      // 각 수신자에 대해 연결 생성
      for (const username of receiverUsernames) {
        const receiver = await this.userRepository.findOne({
          where: { username },
          relations: ['connections', 'connections.connected_user'],
        });

        if (!receiver) {
          failedConnections.push({ username, reason: 'User not found' });
          continue;
        }

        // 자기 자신과의 연결 방지
        if (requester.id === receiver.id) {
          failedConnections.push({
            username,
            reason: 'Cannot connect to yourself',
          });
          continue;
        }

        // 이미 연결되어 있는지 확인
        const existingConnection = await this.connectionRepository.findOne({
          where: [
            { user: { id: requester.id }, connected_user: { id: receiver.id } },
            { user: { id: receiver.id }, connected_user: { id: requester.id } },
          ],
        });

        if (existingConnection) {
          failedConnections.push({
            username,
            reason: 'Connection already exists',
          });
          continue;
        }

        // 양방향 연결 생성
        const connection1 = this.connectionRepository.create({
          user: requester,
          connected_user: receiver,
          proof_image: imageUrl,
        });

        const connection2 = this.connectionRepository.create({
          user: receiver,
          connected_user: requester,
          proof_image: imageUrl,
        });

        await this.connectionRepository.save([connection1, connection2]);
        successfulConnections.push(username);
      }

      return {
        success: true,
        message: 'Connections processed',
        code: 200,
        data: {
          successful: successfulConnections,
          failed: failedConnections,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to process connections: ${error.message}`,
        code: 500,
      };
    }
  }
}
