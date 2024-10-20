import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configure from './configure/configure';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => configure()],
      isGlobal: true,
    })
  ],
  exports: [ConfigModule],
})
export class CommonModule {}
