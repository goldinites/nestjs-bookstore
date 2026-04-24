import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { OrderItemResponse } from '@/modules/order/types/order-item.type';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderResponse } from '@/modules/order/types/order.type';

function mapOrderItemToResponse(orderItem: OrderItem): OrderItemResponse {
  return {
    id: orderItem.id,
    title: orderItem.title,
    price: Number(orderItem.price),
    quantity: orderItem.quantity,
    imageUrl: orderItem.book.imageUrl,
    author: orderItem.book.author,
    publishedYear: orderItem.book.publishedYear,
    genre: orderItem.book.genre,
    language: orderItem.book.language,
  };
}

export function mapOrderToResponse(order: Order): OrderResponse {
  const items: OrderItemResponse[] = order.items.map(mapOrderItemToResponse);

  return {
    id: order.id,
    items,
    totalPrice: Number(order.totalPrice),
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export function mapOrdersToResponse(orders: Order[]): OrderResponse[] {
  return orders.map(mapOrderToResponse);
}
