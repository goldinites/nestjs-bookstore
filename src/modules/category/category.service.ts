import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { CategoryErrors } from '@/modules/category/enums/errors.enum';
import { GetCategoryReqDto } from '@/modules/category/dto/get-category.dto';
import { getCategoryDefaultParams } from '@/modules/category/constants/category.constants';
import { normalizeQuery } from '@/modules/utils/query/normalize-query';
import { GetCategoryOptions } from '@/modules/category/types/category.type';
import { FileService } from '@/modules/file/file.service';

@Injectable()
export class CategoryService {
  private multiFieldsValue: string[] = ['title'] as const;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly fileService: FileService,
  ) {}

  async getCategories(
    query?: GetCategoryReqDto,
    options: GetCategoryOptions = {},
  ) {
    const { field, direction, limit, offset, ...rest } = {
      ...getCategoryDefaultParams,
      ...query,
    };

    const where = normalizeQuery({
      query: rest,
      options: {
        multiFields: this.multiFieldsValue,
      },
    });

    const { select, relations } = options;

    return await this.categoryRepository.findAndCount({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
      relations,
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

  async createCategory(
    payload: CreateCategoryDto,
    image: Express.Multer.File,
  ): Promise<Category> {
    const category = this.categoryRepository.create(payload);

    const imageUrl = this.fileService.createFile(image);

    const created = await this.categoryRepository.save({
      ...category,
      imageUrl,
    });

    if (!created) throw new BadRequestException(CategoryErrors.NOT_CREATED);

    return created;
  }

  async importCategories(payload: CreateCategoryDto[]): Promise<Category[]> {
    const categories = this.categoryRepository.create(payload);

    const created = await this.categoryRepository.save(categories);

    if (!created) throw new BadRequestException(CategoryErrors.NOT_CREATED);

    return created;
  }

  async updateCategory(
    id: number,
    payload: UpdateCategoryDto,
    image: Express.Multer.File,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    const imageUrl = this.fileService.createFile(image);

    const { affected } = await this.categoryRepository.update(id, {
      ...payload,
      imageUrl,
    });

    if (affected === 0)
      throw new BadRequestException(CategoryErrors.NOT_UPDATED);

    const updated = await this.getCategoryById(id);

    if (!updated) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      const categoryRepository = manager.getRepository(Category);

      const category = await categoryRepository.findOne({
        where: { id },
        relations: { books: true },
      });

      if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

      if (category?.books.length)
        throw new BadRequestException(
          CategoryErrors.CANNOT_DELETE_CATEGORY_WITH_BOOKS,
        );

      const { affected } = await categoryRepository.delete(category.id);

      if (affected === 0)
        throw new BadRequestException(CategoryErrors.NOT_DELETED);
    });
  }
}
