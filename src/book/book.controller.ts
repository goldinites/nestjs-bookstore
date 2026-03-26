import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import type { BookGetAllReqDto } from './dto/get-all.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('list')
  getList(@Query() params: BookGetAllReqDto) {
    return this.bookService.getList(params);
  }

  @Get('get/:id')
  find(@Param('id') id: number) {
    return this.bookService.find(id);
  }

  @Post('create')
  create(@Body() payload: Book) {
    return this.bookService.create(payload);
  }

  @Put('update/:id')
  update(@Param('id') id: number, @Body() payload: Partial<Book>) {
    return this.bookService.update(id, payload);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.bookService.delete(id);
  }
}
