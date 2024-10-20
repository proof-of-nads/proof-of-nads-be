import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from 'mysql2';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@app/common/database/entities/user.entity';

@Injectable()
export class ConnectService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly configService: ConfigService,
      ) {
      }

      async requestConnection(requesterId: string, receiverUsername: string): Promise<{ success: boolean; message: string; code: number }> {
        const requester = await this.userRepository.findOne({ where: { id: requesterId } });
        if (!requester) {
        //   throw new NotFoundException('Requester not found');
        }
    
        const receiver = await this.userRepository.findOne({ where: { username: receiverUsername } });
        if (!receiver) {
          return { success: false, message: 'Receiver not found', code: 404 };
        }
    
        if (requester.id === receiver.id) {
          return { success: false, message: 'Cannot connect to yourself', code: 400 };
        }
    
        // Check if connection already exists
        if (requester.first_degree_connections.some(conn => conn.id === receiver.id)) {
          return { success: false, message: 'Connection already exists', code: 409 };
        }
    
        // Add connection
        requester.first_degree_connections.push(receiver);
        receiver.first_degree_connections.push(requester);
    
        await this.userRepository.save(requester);
        await this.userRepository.save(receiver);
    
        return { success: true, message: 'Connection request successful', code: 200 };
      }
}
