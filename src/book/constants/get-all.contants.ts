import { BookGetAllReqDto } from '../dto/get-all.dto';

export const getAllBooksDefaults: Required<BookGetAllReqDto> = {
  field: 'id',
  direction: 'ASC',
  limit: 25,
  offset: 0,
};
