import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/auth')
export class UserController {}
