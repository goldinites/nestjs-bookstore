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
    const { field, direction, limit, offset, withBooks, ...rest } = {
      ...getCategoryDefaultParams,
      ...query,
    };

    const where = normalizeQuery(rest, {
      multiFields: this.multiFieldsValue,
    });

    const [content, total] = await this.categoryRepository.findAndCount({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
      select,
      relations: { books: withBooks },
    });

    return { content, total };
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
