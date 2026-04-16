import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '@/modules/book/entities/book.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  imageUrl: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];

  @Column({ default: 0 })
  booksCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
