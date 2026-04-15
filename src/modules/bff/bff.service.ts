import { Injectable } from '@nestjs/common';
import { MainPageService } from '@/modules/bff/main-page/main-page.service';
import { MainPageData } from '@/modules/bff/main-page/types/main-page.type';

@Injectable()
export class BackendForFrontendService {
  constructor(private readonly mainPageService: MainPageService) {}
  async getMainPageData(): Promise<MainPageData> {
    return await this.mainPageService.buildMainPageData();
  }
}
