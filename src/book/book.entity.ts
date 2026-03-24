import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publishedYear: number;

  @Column()
  genre: string;

  @Column()
  language: string;

  @Column()
  stockCount: number;

  @Column({ type: 'numeric', nullable: true })
  rating: number | null;

  @Column({ type: 'numeric', nullable: true })
  price: number | null;
}
