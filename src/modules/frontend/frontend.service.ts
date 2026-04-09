import { Injectable } from '@nestjs/common';
import { MainPageService } from '@/modules/frontend/main-page/main-page.service';
import { MainPageData } from '@/modules/frontend/main-page/types/main-page.type';

@Injectable()
export class FrontendService {
  constructor(private mainPageService: MainPageService) {}
  async getMainPageData(): Promise<MainPageData> {
    return await this.mainPageService.buildMainPageData();
  }
}
