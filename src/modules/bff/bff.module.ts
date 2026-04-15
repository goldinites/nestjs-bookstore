import { Module } from '@nestjs/common';
import { BackendForFrontendController } from './bff.controller';
import { BackendForFrontendService } from './bff.service';
import { BookModule } from '@/modules/book/book.module';
import { MainPageService } from '@/modules/bff/main-page/main-page.service';
import { CategoryModule } from '@/modules/category/category.module';

@Module({
  imports: [BookModule, CategoryModule],
  controllers: [BackendForFrontendController],
  providers: [BackendForFrontendService, MainPageService],
  exports: [BackendForFrontendService],
})
export class BackendForFrontendModule {}
