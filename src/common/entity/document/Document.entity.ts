import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../Base.entity';

@Entity()
export class Document extends BaseEntity {
    @Column()
    title?: string;

    @Column()
    fileName?: string;

    @Column()
    filePath?: string;

    @Column()
    fileSize?: number;
}
