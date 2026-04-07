import { GetOrderReqDto } from '@/modules/order/dto/get-order.dto';

export const getOrderDefaultParams: Required<
  Pick<GetOrderReqDto, 'field' | 'direction' | 'limit' | 'offset'>
> = {
  field: 'id',
  direction: 'ASC',
  limit: 25,
  offset: 0,
};
