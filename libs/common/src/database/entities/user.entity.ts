import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'UserInfo' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  twitter_id: string;

  @Column({ unique: true })
  wallet_address: string;

  @Column()
  current_profile_picture: string;

  @Column('simple-array')
  profile_picture_history: string[];

  @Column('simple-array')
  badge_list: string[];

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'user_connections',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'connected_user_id',
      referencedColumnName: 'id',
    },
  })
  first_degree_connections: UserEntity[];

  @Column({ nullable: true })
  qr_code: string;

  @CreateDateColumn()
  CreatedAt!: Date;

  @UpdateDateColumn()
  UpdatedAt!: Date;

  @DeleteDateColumn()
  DeletedAt: Date;
}
