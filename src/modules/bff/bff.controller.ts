import { Controller, Get } from '@nestjs/common';
import { BackendForFrontendService } from '@/modules/bff/bff.service';
import { MainPageData } from '@/modules/bff/main-page/types/main-page.type';

@Controller('pages')
export class BackendForFrontendController {
  constructor(private readonly bffService: BackendForFrontendService) {}
  @Get('main')
  async getMainPage(): Promise<MainPageData> {
    return await this.bffService.getMainPageData();
  }
}
