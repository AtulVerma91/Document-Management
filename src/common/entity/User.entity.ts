import { Entity, Column, BeforeInsert } from 'typeorm';
import * as argon2 from 'argon2';
import { BaseEntity } from './Base.entity';
import * as crypto from 'crypto';

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
