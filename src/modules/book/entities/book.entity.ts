import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  imageUrl: string;

  @Column({ length: 255 })
  author: string;

  @Column()
  publishedYear: number;

  @ManyToOne(() => Category)
  category: Category;

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
