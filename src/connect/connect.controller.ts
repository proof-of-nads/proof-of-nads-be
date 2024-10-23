import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConnectService } from './connect.service';
import { UploadedFile } from '@nestjs/common';
import { ConnectionResponse } from './types/connection.types';

@Controller('api/connection')
export class ConnectController {
  constructor(private readonly connectService: ConnectService) {}

  @Post('request')
  @UseInterceptors(FileInterceptor('proofImage'))
  async requestConnections(
    @Body('requesterUsername') requesterUsername: string,
    @Body('receiver_usernames') receiverUsernames: string[],
    @Body('proofImage') proofImage: string,
  ): Promise<ConnectionResponse> {
    return this.connectService.requestConnections(
    requesterUsername,
      receiverUsernames,
      proofImage
    );
  }
}
