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
} from '@nestjs/common';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { UserService } from './user.service';

@Controller('api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':userId/connect-twitter')
  async connectTwitter(
    @Param('userId') userId: string,
    @Body('twitterId') twitterId: string,
  ) {
    return this.userService.connectTwitter(userId, twitterId);
  }

  @Patch(':userId/connect-wallet')
  async connectWallet(
    @Param('userId') userId: string,
    @Body('walletAddress') walletAddress: string,
  ) {
    return this.userService.connectWallet(userId, walletAddress);
  }

  @Post('signup')
  async createUser(@Body() userData: Partial<UserEntity>) {
    return await this.userService.createUser(userData);
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

  @Get(':userId/connections')
  async getUserConnections(@Param('userId') userId: string) {
    const connections = await this.userService.getUserConnections(userId);
    return connections.map((user) => ({
      id: user.id,
      username: user.username,
      current_profile_picture: user.current_profile_picture,
    }));
  }
}
