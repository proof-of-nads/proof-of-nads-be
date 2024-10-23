// connection.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'Connections' })
export class ConnectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => UserEntity)
  connected_user: UserEntity;

  @Column()
  proof_image: string;

  @CreateDateColumn()
  CreatedAt!: Date;
}
