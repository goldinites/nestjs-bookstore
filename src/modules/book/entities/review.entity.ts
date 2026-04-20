import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity()
@Index(['createdAt'])
@Index(['user', 'book'], { unique: true })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'numeric', precision: 3, scale: 1, default: 0 })
  rating: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
