import { GetListBookReqDto } from '../dto/get-list-book.dto';

export const getListBooksDefaultParams: Required<GetListBookReqDto> = {
  field: 'id',
  direction: 'ASC',
  limit: 25,
  offset: 0,
};
