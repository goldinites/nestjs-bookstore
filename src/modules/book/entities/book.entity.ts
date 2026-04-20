import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';
import { Review } from '@/modules/book/entities/review.entity';

@Entity()
@Index(['author', 'genre', 'language', 'createdAt'])
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  imageUrl: string;

  @Column({ length: 255 })
  author: string;

  @Column({ length: 255 })
  genre: string;

  @ManyToOne(() => Category)
  category: Category;

  @Column()
  publishedYear: number;

  @OneToMany(() => Review, (review) => review.book, { cascade: true })
  reviews: Review[];

  @Column({ length: 255 })
  language: string;

  @Column({ default: 0 })
  stockCount: number;

  @Column({ type: 'numeric', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  purchasesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
