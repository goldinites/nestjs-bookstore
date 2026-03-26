import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import type { GetListBookReqDto } from './dto/get-list-book.dto';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getList(@Query() params: GetListBookReqDto) {
    return this.bookService.getList(params);
  }

  @Get('/:id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.find(id);
  }

  @Post()
  create(@Body() payload: CreateBookDto) {
    return this.bookService.create(payload);
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ) {
    return this.bookService.update(id, payload);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.delete(id);
  }
}
