import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { CategoryErrors } from '@/modules/category/enums/errors.enum';
import { GetCategoryReqDto } from '@/modules/category/dto/get-category.dto';
import { getCategoryDefaultParams } from '@/modules/category/constants/get-category.constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(query: GetCategoryReqDto): Promise<Category[]> {
    const { field, direction, limit, offset, withBooks, ...where } = {
      ...getCategoryDefaultParams,
      ...query,
    };

    return await this.categoryRepository.find({
      where,
      order: {
        [field]: direction,
      },
      take: limit,
      skip: offset,
      relations: { books: withBooks },
    });
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async createCategory(payload: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(payload);
    return await this.categoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    payload: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    const { affected } = await this.categoryRepository.update(id, payload);

    if (affected === 0)
      throw new BadRequestException(CategoryErrors.NOT_UPDATED);

    const updated = await this.getCategoryById(id);

    if (!updated) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);

    if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    await this.categoryRepository.remove(category);
  }

  async importCategories(payload: CreateCategoryDto[]): Promise<Category[]> {
    const categories = this.categoryRepository.create(payload);

    return await this.categoryRepository.save(categories);
  }
}
