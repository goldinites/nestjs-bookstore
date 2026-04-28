import { OrderItemResponse } from '@/modules/order/types/order-item.type';
import { OrderStatus } from '@/modules/order/enums/status.enum';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Order } from '@/modules/order/entities/order.entity';

export type GetOrderOptions = {
  select?: FindOptionsSelect<Order>;
  relations?: FindOptionsRelations<Order>;
};

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
