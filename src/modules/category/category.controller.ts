import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from '@/modules/category/category.service';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { GetCategoryReqDto } from '@/modules/category/dto/get-category.dto';
import { CategoryErrors } from '@/modules/category/enums/errors.enum';
import {
  CategoryResponse,
  GetCategoriesResponse,
} from '@/modules/category/types/category.type';
import {
  mapCategoriesToResponse,
  mapCategoryToResponse,
} from '@/modules/category/mappers/category-to-response.mapper';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { Roles } from '@/modules/user/enums/roles.enum';
import { FilesUploadInterceptor } from '@/modules/file/interceptors/file-upload.interceptor';
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import { RequiredFilePipe } from '@/modules/file/pipes/required-file.pipe';
import { prepareFileMetadata } from '@/modules/file/utils/prepare-metadata.util';
import { FileService } from '@/modules/file/file.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Permissions(Roles.ADMIN)
@Controller('category')
class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getCategories(
    @Query() query: GetCategoryReqDto,
  ): Promise<GetCategoriesResponse> {
    const [content, total] = await this.categoryService.getCategories(query);

    return {
      content: mapCategoriesToResponse(content),
      total,
    };
  }

  @Get(':id')
  async getCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponse> {
    const category = await this.categoryService.getCategoryById(id);

    if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    return mapCategoryToResponse(category);
  }

  @Post()
  @UseInterceptors(
    FilesUploadInterceptor(UploadType.IMAGE, {
      fieldName: 'image',
      mode: 'single',
    }),
  )
  async createCategory(
    @Body() payload: CreateCategoryDto,
    @UploadedFile(RequiredFilePipe())
    image: Express.Multer.File,
  ): Promise<CategoryResponse> {
    if (image) {
      this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

      payload.imageUrl = this.fileService.buildPublicUrl(image.filename);
    }

    const category = await this.categoryService.createCategory(payload);

    return mapCategoryToResponse(category);
  }

  @Post('import')
  async importCategories(
    @Body(new ParseArrayPipe({ items: CreateCategoryDto }))
    payload: CreateCategoryDto[],
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryService.importCategories(payload);

    return mapCategoriesToResponse(categories);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesUploadInterceptor(UploadType.IMAGE, {
      fieldName: 'image',
      mode: 'single',
    }),
  )
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto,
    @UploadedFile(RequiredFilePipe())
    image: Express.Multer.File,
  ): Promise<CategoryResponse> {
    if (image) {
      this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

      payload.imageUrl = this.fileService.buildPublicUrl(image.filename);
    }

    const category = await this.categoryService.updateCategory(id, payload);

    return mapCategoryToResponse(category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}

export default CategoryController;
