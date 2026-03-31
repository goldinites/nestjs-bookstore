import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { GetBookReqDto } from '@/modules/book/dto/get-book.dto';
import { CreateBookDto } from '@/modules/book/dto/create-book.dto';
import { UpdateBookDto } from '@/modules/book/dto/update-book.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { DeleteBookResponse } from '@/modules/book/types/delete-book.type';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { Roles } from '@/modules/user/enums/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Book | null> {
    return this.bookService.findOne({ id });
  }

  @Get()
  find(@Query() query: GetBookReqDto): Promise<Book[]> {
    return this.bookService.find(query);
  }

  @Post()
  @Permissions(Roles.ADMIN)
  create(@Body() payload: CreateBookDto): Promise<Book> {
    return this.bookService.create(payload);
  }

  @Post('import')
  @Permissions(Roles.ADMIN)
  async import(
    @Body(new ParseArrayPipe({ items: CreateBookDto }))
    payload: CreateBookDto[],
  ): Promise<Book[]> {
    if (payload.length === 0) return [];

    return await this.bookService.import(payload);
  }

  @Patch(':id')
  @Permissions(Roles.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<Book | null> {
    return this.bookService.update(id, payload);
  }

  @Delete(':id')
  @Permissions(Roles.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteBookResponse> {
    return this.bookService.delete(id);
  }
}
