import { Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from '@/modules/category/category.service';
import { Category } from '@/modules/category/entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  @Post('import')
  async importCategories(): Promise<Category[]> {
    const categories = await this.categoryService.importCategories();

    if (categories.length === 0) return [];

    return categories;
  }
}
