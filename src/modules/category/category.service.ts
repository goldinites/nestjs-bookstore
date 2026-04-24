import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsSelect, Repository } from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { CategoryErrors } from '@/modules/category/enums/errors.enum';
import { GetCategoryReqDto } from '@/modules/category/dto/get-category.dto';
import { getCategoryDefaultParams } from '@/modules/category/constants/get-category.constants';
import { normalizeQuery } from '@/modules/utils/query/normalize-query';

@Injectable()
export class CategoryService {
  private multiFieldsValue: string[] = ['title'] as const;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(
    query?: GetCategoryReqDto,
    select?: FindOptionsSelect<Category>,
  ) {
    const { field, direction, limit, offset, ...rest } = {
      ...getCategoryDefaultParams,
      ...query,
    };

    const where = normalizeQuery(rest, {
      multiFields: this.multiFieldsValue,
    });

    return await this.categoryRepository.findAndCount({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
      relations: { books: Boolean(select?.books) },
      select,
    });
  }

  async getCategoryById(
    id: number,
    select?: FindOptionsSelect<Category>,
  ): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: { books: Boolean(select?.books) },
      select,
    });
  }

  async createCategory(payload: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(payload);
    return await this.categoryRepository.save(category);
  }

  async importCategories(payload: CreateCategoryDto[]): Promise<Category[]> {
    const categories = this.categoryRepository.create(payload);

    return await this.categoryRepository.save(categories);
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

    if (category.booksCount > 0)
      throw new BadRequestException(
        CategoryErrors.CANNOT_DELETE_CATEGORY_WITH_BOOKS,
      );

    await this.categoryRepository.remove(category);
  }
}
