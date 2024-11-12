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
import {
  IProfileUserData,
  IUser,
  IUserConnections,
  IProfileEntry,
  IConnection,
  Address,
  IProofEntry,
  IEdge,
  IProfileUserDataWithEdges,
} from './types/user.types';

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
      where: { username },
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

  // async getUserConnections(userId: string): Promise<
  //   {
  //     id: string;
  //     username: string;
  //     current_profile_picture: string;
  //     proof_image: string;
  //   }[]
  // > {
  //   const connections = await this.connectionRepository.find({
  //     where: { user: { id: userId } },
  //     relations: ['connected_user'],
  //   });

  //   if (!connections) {
  //     return [];
  //   }

  //   return connections.map((connection) => ({
  //     id: connection.connected_user.id,
  //     username: connection.connected_user.username,
  //     current_profile_picture:
  //       connection.connected_user.current_profile_picture,
  //     proof_image: connection.proof_image,
  //   }));
  // }

  async getProfileData(username: string): Promise<IProfileUserData> {
    // 1. Get user data with connections
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['connections', 'connections.connected_user'],
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    // 2. Transform user data to IUser
    const userData: IUser = {
      username: user.username,
      twitterHandle: user.twitter_id || null,
      discordHandle: user.discord_id || null,
      profilePicture: user.current_profile_picture,
    };

    // 3. Get and transform connections
    const firstConnections = await this.getFirstDegreeConnections(user);
    const secondConnections = await this.getSecondDegreeConnections(user);

    const userConnections: IUserConnections = {
      firstConnections,
      secondConnections,
    };

    // 4. Transform profile history
    const profileHistory: IProfileEntry[] = user.profile_picture_history.map(
      (imgSrc) => ({
        imgSrc,
        date: new Date(), // 실제 날짜 정보가 없으므로 현재 날짜 사용
      }),
    );

    // 5. Transform proof history (현재 엔티티에는 없으므로 빈 배열 반환)
    const proofHistory: IProofEntry[] = [];

    // 6. Return complete profile data
    return {
      user: userData,
      userConnections,
      missions: [], // 미정이므로 빈 배열
      guestBook: [], // 엔티티에 없으므로 빈 배열
      profileHistory,
      proofHistory,
    };
  }

  private async getFirstDegreeConnections(
    user: UserEntity,
  ): Promise<IConnection[]> {
    return user.connections.map((connection) => ({
      username: connection.connected_user.username,
      address: connection.connected_user.wallet_address as Address,
      twitterHandle: connection.connected_user.twitter_id || null,
      discordHandle: connection.connected_user.discord_id || null,
      profilePicture: connection.connected_user.current_profile_picture,
    }));
  }

  private async getSecondDegreeConnections(
    user: UserEntity,
  ): Promise<IConnection[]> {
    const firstDegreeUserIds = user.connections.map(
      (conn) => conn.connected_user.id,
    );

    const secondDegreeConnections: IConnection[] = [];

    for (const connection of user.connections) {
      const secondaryUser = await this.userRepository.findOne({
        where: { id: connection.connected_user.id },
        relations: ['connections', 'connections.connected_user'],
      });

      if (secondaryUser && secondaryUser.connections) {
        for (const secondaryConnection of secondaryUser.connections) {
          const secondaryUser = secondaryConnection.connected_user;

          // Skip if user is the original user or in first degree connections
          if (
            secondaryUser.id !== user.id &&
            !firstDegreeUserIds.includes(secondaryUser.id) &&
            !secondDegreeConnections.some(
              (conn) => conn.username === secondaryUser.username,
            )
          ) {
            secondDegreeConnections.push({
              username: secondaryUser.username,
              address: secondaryUser.wallet_address as Address,
              twitterHandle: secondaryUser.twitter_id || null,
              discordHandle: secondaryUser.discord_id || null,
              profilePicture: secondaryUser.current_profile_picture,
            });
          }
        }
      }
    }

    return secondDegreeConnections;
  }

  async updateProfilePicture(
    username: string,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 서버의 도메인 설정 (환경변수에서 가져오기)
    const domain = this.configService.get<string>('DOMAIN');
    const fileUrl = `${domain}/uploads/profile-pictures/${file.filename}`;

    // 현재 프로필 사진을 히스토리에 추가
    if (user.current_profile_picture) {
      user.profile_picture_history = [
        ...user.profile_picture_history,
        user.current_profile_picture,
      ];
    }

    // 새로운 프로필 사진 URL 설정
    user.current_profile_picture = fileUrl;

    return await this.userRepository.save(user);
  }

  async getEdgeData(username: string): Promise<IEdge[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['connections', 'connections.connected_user'],
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const edges: IEdge[] = [];
    const processedConnections = new Set<string>();

    // Helper function to create unique edge key
    const createEdgeKey = (source: string, target: string): string => {
      const [first, second] = [source, target].sort();
      return `edge_${first}_${second}`;
    };

    // Helper function to add edge
    const addEdge = (source: string, target: string): void => {
      const edgeKey = createEdgeKey(source, target);
      if (!processedConnections.has(edgeKey)) {
        edges.push({
          key: edgeKey,
          source: source,
          target: target,
        });
        processedConnections.add(edgeKey);
      }
    };

    // 첫번째 연결 관계의 edges
    for (const connection of user.connections) {
      addEdge(user.username, connection.connected_user.username);
    }

    // 두번째 연결 관계의 edges
    for (const connection of user.connections) {
      const secondaryUser = await this.userRepository.findOne({
        where: { id: connection.connected_user.id },
        relations: ['connections', 'connections.connected_user'],
      });

      if (secondaryUser && secondaryUser.connections) {
        for (const secondConnection of secondaryUser.connections) {
          if (secondConnection.connected_user.username !== user.username) {
            addEdge(
              secondaryUser.username,
              secondConnection.connected_user.username,
            );
          }
        }
      }
    }

    return edges;
  }

  async getMockData() {
    // 4. Transform profile history
    const profileHistory = [
      "http://51.89.7.79:7777/uploads/profile-pictures/1731325922779-928469520.png",
      "https://github.com/ByungHeonLEE/test2/blob/main/profile/Shuwski.jpg?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/profile/baram7.png?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/profile/whitesocks.jpg?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/profile/BenjaNad.jpg?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/profile/PaulC.jpg?raw=true",
    ]

    // 5. Transform proof history (현재 엔티티에는 없으므로 빈 배열 반환)
    const proofHistory = [
      "https://github.com/ByungHeonLEE/test2/blob/main/proof/8.png?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/proof/7.png?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/proof/6.png?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/proof/5.png?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/proof/4.png?raw=true",
      "https://github.com/ByungHeonLEE/test2/blob/main/proof/3.png?raw=true",
    ];
    return {
      profileHistory: profileHistory,
      proofHistory: proofHistory,
    }
  }
}
