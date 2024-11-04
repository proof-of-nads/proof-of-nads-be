import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Res,
  UnauthorizedException,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { UserService } from './user.service';
import { IProfileUserData } from './types/user.types';

@Controller('api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(
    @Body()
    userData: {
      username: string;
      current_profile_picture?: string;
      discord_id?: string;
      wallet_address?: string;
    },
  ): Promise<UserEntity> {
    if (!userData.username) {
      throw new UnauthorizedException('Username is required');
    }
    return await this.userService.createUser({
      username: userData.username,
      current_profile_picture: userData.current_profile_picture || '',
      twitter_id: userData.discord_id,
      wallet_address: userData.wallet_address,
      profile_picture_history: [],
      badge_list: [],
      qr_code: '',
    });
  }

  @Patch(':userId/connect-twitter')
  async connectTwitter(
    @Param('userId') userId: string,
    @Body('twitterId') twitterId: string,
  ) {
    return this.userService.connectTwitter(userId, twitterId);
  }

  @Patch(':userId/connect-discord')
  async connectDiscord(
    @Param('userId') userId: string,
    @Body('discordId') discordId: string,
  ) {
    return this.userService.connectDiscord(userId, discordId);
  }

  @Patch(':userId/connect-wallet')
  async connectWallet(
    @Param('userId') userId: string,
    @Body('walletAddress') walletAddress: string,
  ) {
    return this.userService.connectWallet(userId, walletAddress);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.userService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  @Patch(':userId/profile')
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateData: Partial<UserEntity>,
  ) {
    return await this.userService.updateUserProfile(userId, updateData);
  }

  // @Get(':userId/connections')
  // async getUserConnections(@Param('userId') userId: string) {
  //   return await this.userService.getUserConnections(userId);
  // }

  @Get(':username')
  async getProfile(@Param('username') username: string): Promise<IProfileUserData> {
    const profile = await this.userService.getProfileData(username);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
