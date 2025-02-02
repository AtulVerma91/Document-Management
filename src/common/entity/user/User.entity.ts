import { Entity, Column, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';
import { BaseEntity } from '../Base.entity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = crypto.createHash('md5').update(this.password).digest('hex').toString();

  }
}
