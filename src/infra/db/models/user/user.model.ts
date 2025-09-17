import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'primaky_key_user_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ unique: true })
  @Index(['email'])
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
