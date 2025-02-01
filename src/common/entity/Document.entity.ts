import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { User } from './User.entity';

@Entity()
export class Document extends BaseEntity {
    @Column()
    title?: string;

    @Column()
    fileName?: string;

    @Column()
    fileSize?: number;
}
