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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '@/modules/category/category.service';
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { GetCategoryReqDto } from '@/modules/category/dto/get-category.dto';
import { CategoryErrors } from '@/modules/category/enums/errors.enum';
import { CategoryResponse } from '@/modules/category/types/category.type';
import {
  mapCategoriesToResponse,
  mapCategoryToResponse,
} from '@/modules/category/mappers/category-to-response.mapper';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { Roles } from '@/modules/user/enums/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Permissions(Roles.ADMIN)
@Controller('category')
class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(
    @Query() query: GetCategoryReqDto,
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryService.getCategories(query);

    return mapCategoriesToResponse(categories);
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
  async createCategory(
    @Body() payload: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    const category = await this.categoryService.createCategory(payload);

    return mapCategoryToResponse(category);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    const category = await this.categoryService.updateCategory(id, payload);

    return mapCategoryToResponse(category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }

  @Post('import')
  async importCategories(
    @Body(new ParseArrayPipe({ items: CreateCategoryDto }))
    payload: CreateCategoryDto[],
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryService.importCategories(payload);

    return mapCategoriesToResponse(categories);
  }
}

export default CategoryController;
