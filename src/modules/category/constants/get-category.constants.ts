import { GetCategoryReqDto } from '@/modules/category/dto/get-category.dto';

export const getCategoryDefaultParams: Required<
  Pick<GetCategoryReqDto, 'field' | 'direction' | 'limit' | 'offset'>
> = {
  field: 'id',
  direction: 'ASC',
  limit: 25,
  offset: 0,
};
