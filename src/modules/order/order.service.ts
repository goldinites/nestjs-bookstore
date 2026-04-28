import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from '@/modules/order/entities/order.entity';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { CartErrors } from '@/modules/cart/enums/errors.enum';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { OrderStatus } from '@/modules/order/enums/status.enum';
import { Book } from '@/modules/book/entities/book.entity';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { OrderErrors } from '@/modules/order/enums/errors.enum';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GetOrderReqDto } from '@/modules/order/dto/get-order.dto';
import { getOrderDefaultParams } from '@/modules/order/constants/get-order.constants';
import {
  PURCHASES_COUNT_PROPERTY,
  STOCK_COUNT_PROPERTY,
} from '@/modules/book/constants/book.constants';
import { GetOrderOptions } from '@/modules/order/types/order.type';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getOrders(
    userId: number,
    query?: GetOrderReqDto,
    options: GetOrderOptions = {},
  ) {
    const { field, direction, limit, offset, ...rest } = {
      ...getOrderDefaultParams,
      ...query,
    };

    const { select, relations } = options;

    return await this.orderRepository.findAndCount({
      where: { user: { id: userId }, ...rest },
      order: { [field]: direction },
      take: limit,
      skip: offset,
      relations,
      select,
    });
  }

  async getOrderById(
    userId: number,
    id: number,
    options: GetOrderOptions = {},
  ): Promise<Order | null> {
    const { select, relations } = options;

    return await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations,
      select,
    });
  }

  async createOrder(userId: number): Promise<Order> {
    return await this.dataSource.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      const orderRepository = manager.getRepository(Order);
      const orderItemRepository = manager.getRepository(OrderItem);
      const bookRepository = manager.getRepository(Book);

      const cart: Cart | null = await cartRepository.findOne({
        where: { user: { id: userId } },
        relations: { items: { book: true } },
      });

      if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

      if (!cart.items.length)
        throw new BadRequestException(CartErrors.CART_IS_EMPTY);

      for (const cartItem of cart.items) {
        const book: Book | null = await bookRepository.findOne({
          where: { id: cartItem.book.id },
        });

        if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

        if (cartItem.quantity > book.stockCount) {
          throw new BadRequestException(CartErrors.QUANTITY_NOT_AVAILABLE);
        }
      }

      const totalPrice: number = cart.items.reduce(
        (sum: number, item: CartItem): number =>
          sum + item.quantity * Number(item.book.price ?? 0),
        0,
      );

      const order: Order = await orderRepository.save(
        orderRepository.create({
          user: { id: userId },
          status: OrderStatus.NEW,
          totalPrice,
        }),
      );

      const orderItems: OrderItem[] = cart.items.map((item: CartItem) =>
        orderItemRepository.create({
          order,
          book: item.book,
          title: item.book.title,
          price: Number(item.book.price ?? 0),
          quantity: item.quantity,
        }),
      );

      await orderItemRepository.save(orderItems);

      for (const cartItem of cart.items) {
        await bookRepository.decrement(
          { id: cartItem.book.id },
          STOCK_COUNT_PROPERTY,
          cartItem.quantity,
        );
      }

      await cartRepository.remove(cart);

      const createdOrder: Order | null = await orderRepository.findOne({
        where: { id: order.id, user: { id: userId } },
        relations: { items: true },
      });

      if (!createdOrder) throw new BadRequestException(OrderErrors.NOT_CREATED);

      return createdOrder;
    });
  }

  async completeOrder(userId: number, id: number): Promise<Order> {
    return await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const bookRepository = manager.getRepository(Book);

      const order: Order | null = await orderRepository.findOne({
        where: { id, user: { id: userId } },
        relations: { items: true },
      });

      if (!order) throw new NotFoundException(OrderErrors.NOT_FOUND);

      if (
        order.status === OrderStatus.CANCELLED ||
        order.status === OrderStatus.COMPLETED
      ) {
        throw new BadRequestException(OrderErrors.NOT_COMPLETED);
      }

      for (const item of order.items) {
        await bookRepository.increment(
          { id: item.book.id },
          PURCHASES_COUNT_PROPERTY,
          item.quantity,
        );
      }

      order.status = OrderStatus.COMPLETED;

      const updatedOrder = await orderRepository.save(order);

      if (!updatedOrder)
        throw new BadRequestException(OrderErrors.NOT_COMPLETED);

      return updatedOrder;
    });
  }

  async cancelOrder(userId: number, id: number): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const orderItemRepository = manager.getRepository(OrderItem);
      const bookRepository = manager.getRepository(Book);

      const order: Order | null = await orderRepository.findOne({
        where: { id, user: { id: userId } },
        relations: { items: true },
      });

      if (!order) throw new NotFoundException(OrderErrors.NOT_FOUND);

      if (
        order.status === OrderStatus.CANCELLED ||
        order.status === OrderStatus.COMPLETED
      ) {
        throw new BadRequestException(OrderErrors.NOT_CANCELLED);
      }

      for (const item of order.items) {
        await bookRepository.increment(
          { id: item.book.id },
          STOCK_COUNT_PROPERTY,
          item.quantity,
        );

        await bookRepository.decrement(
          { id: item.book.id },
          PURCHASES_COUNT_PROPERTY,
          item.quantity,
        );
      }

      await orderItemRepository.remove(order.items);

      order.status = OrderStatus.CANCELLED;

      const result: Order = await orderRepository.save(order);

      if (!result) throw new BadRequestException(OrderErrors.NOT_CANCELLED);
    });
  }
}
