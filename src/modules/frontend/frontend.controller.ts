import { Controller, Get } from '@nestjs/common';
import { FrontendService } from '@/modules/frontend/frontend.service';
import { MainPageData } from '@/modules/frontend/main-page/types/main-page.type';

@Controller('pages')
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}
  @Get('main')
  async getMainPage(): Promise<MainPageData> {
    return await this.frontendService.getMainPageData();
  }
}
