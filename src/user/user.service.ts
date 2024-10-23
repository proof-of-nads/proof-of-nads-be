import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { queryPromise, createConnection } from '@app/common/database/db/mysql';
import { Connection } from 'mysql2';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { ConnectionEntity } from '@app/common/database/entities/connection.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private connection: Connection;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,
    private readonly configService: ConfigService,
  ) {
    this.initDb();
  }

  async initDb(): Promise<void> {
    try {
      this.connection = await createConnection();
      console.log('connected');
    } catch (error) {
      console.error();
    }
  }

  public async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    const userUUID = uuidv4();
    const user = this.userRepository.create({
      id: userUUID,
      ...userData,
      connections: [], // first_degree_connections 대신 connections 사용
    });
    return await this.userRepository.save(user);
  }

  async connectTwitter(userId: string, twitterId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: { twitter_id: twitterId },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException(
        'This Twitter ID is already connected to another account',
      );
    }

    user.twitter_id = twitterId;
    return this.userRepository.save(user);
  }

  async connectDiscord(userId: string, discordId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: { discord_id: discordId },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException(
        'This Discord ID is already connected to another account',
      );
    }

    user.discord_id = discordId;
    return this.userRepository.save(user);
  }

  async connectWallet(
    userId: string,
    walletAddress: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: { wallet_address: walletAddress },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException(
        'This wallet address is already connected to another account',
      );
    }

    user.wallet_address = walletAddress;
    return this.userRepository.save(user);
  }

  public async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  public async findUser(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {},
    });
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public async updateUserProfile(
    id: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async getUserConnections(userId: string): Promise<
    {
      id: string;
      username: string;
      current_profile_picture: string;
      proof_image: string;
    }[]
  > {
    const connections = await this.connectionRepository.find({
      where: { user: { id: userId } },
      relations: ['connected_user'],
    });

    if (!connections) {
      return [];
    }

    return connections.map((connection) => ({
      id: connection.connected_user.id,
      username: connection.connected_user.username,
      current_profile_picture:
        connection.connected_user.current_profile_picture,
      proof_image: connection.proof_image,
    }));
  }
}
