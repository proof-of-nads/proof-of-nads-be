import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ConnectService } from './connect.service';

@Controller('api/connection')
export class ConnectController {
  constructor(private readonly connectService: ConnectService) {}

  @Post('request')
  async requestConnection(@Body() body: { requester_id: string; receiver_username: string }) {
    return this.connectService.requestConnection(body.requester_id, body.receiver_username);
  }
}