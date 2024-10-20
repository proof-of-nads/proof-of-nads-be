import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { queryPromise, createConnection } from '@app/common/database/db/mysql';
import { Connection } from 'mysql2';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private connection: Connection;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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

  public async createUser(): Promise<UserEntity> {
    const userUUID = uuidv4();
    const user = new UserEntity();
    user.id = userUUID;

    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);

    return newUser;
  }

  public async deleteUser(id: string): Promise<string> {
    await this.userRepository.delete(id);
    return id;
  }

  public async findUser(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {},
    });
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public async updateUser(id: string, user: UserEntity): Promise<string> {
    await this.userRepository.update(id, user);
    return id;
  }
}
