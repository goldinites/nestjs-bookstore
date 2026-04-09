import { Module } from '@nestjs/common';
import { FrontendController } from './frontend.controller';
import { FrontendService } from './frontend.service';
import { BookModule } from '@/modules/book/book.module';
import { MainPageService } from '@/modules/frontend/main-page/main-page.service';

@Module({
  imports: [BookModule],
  controllers: [FrontendController],
  providers: [FrontendService, MainPageService],
  exports: [FrontendService],
})
export class FrontendModule {}
