import { GetBookReqDto } from '@/modules/book/dto/get-book.dto';

export const getBookDefaultParams: Required<
  Pick<GetBookReqDto, 'field' | 'direction' | 'limit' | 'offset'>
> = {
  field: 'id',
  direction: 'ASC',
  limit: 25,
  offset: 0,
};
