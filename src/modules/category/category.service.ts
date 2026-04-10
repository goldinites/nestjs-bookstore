import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async importCategories() {
    const categories = this.categoryRepository.create([
      {
        title: 'Programming',
        description:
          'Книги по программированию, рефакторингу, архитектуре и практике разработки.',
        imageUrl: '/uploads/categories/programming.jpg',
      },
      {
        title: 'Computer Science',
        description:
          'Книги по алгоритмам, вычислениям и основам computer science.',
        imageUrl: '/uploads/categories/computer-science.jpg',
      },
      {
        title: 'Productivity',
        description:
          'Книги о личной эффективности, концентрации и управлении временем.',
        imageUrl: '/uploads/categories/productivity.jpg',
      },
      {
        title: 'Self-Help',
        description: 'Книги о привычках, саморазвитии и личностном росте.',
        imageUrl: '/uploads/categories/self-help.jpg',
      },
      {
        title: 'History',
        description: 'Книги об истории, цивилизациях и развитии человечества.',
        imageUrl: '/uploads/categories/history.jpg',
      },
      {
        title: 'Psychology',
        description: 'Книги о мышлении, поведении и когнитивных процессах.',
        imageUrl: '/uploads/categories/psychology.jpg',
      },
      {
        title: 'Fantasy',
        description:
          'Художественные книги с магией, вымышленными мирами и эпическими сюжетами.',
        imageUrl: '/uploads/categories/fantasy.jpg',
      },
      {
        title: 'Science Fiction',
        description:
          'Фантастические книги о технологиях, будущем и необычных мирах.',
        imageUrl: '/uploads/categories/science-fiction.jpg',
      },
      {
        title: 'Dystopian',
        description:
          'Книги о мрачных антиутопических обществах и будущем человечества.',
        imageUrl: '/uploads/categories/dystopian.jpg',
      },
      {
        title: 'Fiction',
        description: 'Художественная литература разных направлений и стилей.',
        imageUrl: '/uploads/categories/fiction.jpg',
      },
      {
        title: 'Fable',
        description:
          'Притчи и сказочные истории с моралью и символическим смыслом.',
        imageUrl: '/uploads/categories/fable.jpg',
      },
      {
        title: 'Magical Realism',
        description:
          'Произведения, где реальность переплетается с элементами магии.',
        imageUrl: '/uploads/categories/magical-realism.jpg',
      },
      {
        title: 'Classic',
        description: 'Классическая литература, проверенная временем.',
        imageUrl: '/uploads/categories/classic.jpg',
      },
      {
        title: 'Thriller',
        description:
          'Напряжённые книги с интригой, расследованиями и динамичным сюжетом.',
        imageUrl: '/uploads/categories/thriller.jpg',
      },
      {
        title: 'Memoir',
        description:
          'Автобиографические и мемуарные книги о реальном жизненном опыте.',
        imageUrl: '/uploads/categories/memoir.jpg',
      },
      {
        title: 'Gothic Fiction',
        description:
          'Мрачная художественная литература с атмосферой тайны и драматизма.',
        imageUrl: '/uploads/categories/gothic-fiction.jpg',
      },
    ]);

    return await this.categoryRepository.save(categories);
  }
}
