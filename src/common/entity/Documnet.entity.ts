import { Entity, Column } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity()
export class Document extends BaseEntity {
    @Column()
    title: string;

    @Column()
    filePath: string;
}
