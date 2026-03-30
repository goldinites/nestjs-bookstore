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
import { GetListBookReqDto } from '@/modules/book/dto/get-list-book.dto';
import { CreateBookDto } from '@/modules/book/dto/create-book.dto';
import { UpdateBookDto } from '@/modules/book/dto/update-book.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { DeleteBookResponse } from '@/modules/book/types/delete-book.type';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { Roles } from '@/modules/user/enums/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Permissions(Roles.ADMIN)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getList(@Query() params: GetListBookReqDto): Promise<Book[]> {
    return this.bookService.getList(params);
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.bookService.find(id);
  }

  @Post()
  create(@Body() payload: CreateBookDto): Promise<Book> {
    return this.bookService.create(payload);
  }

  @Post('import')
  async import(
    @Body(new ParseArrayPipe({ items: CreateBookDto }))
    payload: CreateBookDto[],
  ): Promise<void> {
    if (payload.length === 0) return;

    for (const book of payload) {
      await this.bookService.create(book);
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteBookResponse> {
    return this.bookService.delete(id);
  }
}
