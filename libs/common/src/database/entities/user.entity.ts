import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ConnectionEntity } from './connection.entity';

@Entity({ name: 'UserInfo' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  twitter_id: string;

  @Column({ nullable: true })
  discord_id: string;

  @Column({ unique: true })
  wallet_address: string;

  @Column()
  current_profile_picture: string;

  @Column('simple-array')
  profile_picture_history: string[];

  @Column('simple-array')
  badge_list: string[];

  // ManyToMany 관계를 OneToMany로 변경
  @OneToMany(() => ConnectionEntity, (connection) => connection.user)
  connections: ConnectionEntity[];

  @Column({ nullable: true })
  qr_code: string;

  @CreateDateColumn()
  CreatedAt!: Date;

  @UpdateDateColumn()
  UpdatedAt!: Date;

  @DeleteDateColumn()
  DeletedAt: Date;
}
