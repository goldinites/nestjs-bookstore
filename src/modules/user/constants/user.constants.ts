import { GetUserReqDto } from '@/modules/user/dto/get-user.dto';

export const getUserDefaultParams: Required<
  Pick<GetUserReqDto, 'field' | 'direction' | 'limit' | 'offset'>
> = {
  field: 'id',
  direction: 'ASC',
  limit: 25,
  offset: 0,
};
