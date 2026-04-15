import { OrderItemResponse } from '@/modules/order/types/order-item.type';
import { OrderStatus } from '@/modules/order/enums/status.enum';

export type OrderResponse = {
  id: number;
  items: OrderItemResponse[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetOrdersResponse = {
  content: OrderResponse[];
  total: number;
};
