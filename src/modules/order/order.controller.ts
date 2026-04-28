import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/types/auth-user.type';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { OrderService } from '@/modules/order/order.service';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderErrors } from './enums/errors.enum';
import {
  GetOrdersResponse,
  OrderResponse,
} from '@/modules/order/types/order.type';
import {
  mapOrdersToResponse,
  mapOrderToResponse,
} from '@/modules/order/mappers/order-to-response.mapper';
import { GetOrderReqDto } from '@/modules/order/dto/get-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(
    @CurrentUser() { userId }: AuthUser,
    @Query() query: GetOrderReqDto,
  ): Promise<GetOrdersResponse> {
    const [content, total] = await this.orderService.getOrders(userId, query);

    return { content: mapOrdersToResponse(content), total };
  }

  @Get(':orderId')
  async getOrderById(
    @CurrentUser() { userId }: AuthUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderResponse> {
    const order: Order | null = await this.orderService.getOrderById(
      userId,
      orderId,
    );

    if (!order) throw new NotFoundException(OrderErrors.NOT_FOUND);

    return mapOrderToResponse(order);
  }

  @Post()
  async createOrder(
    @CurrentUser() { userId }: AuthUser,
  ): Promise<OrderResponse> {
    const order = await this.orderService.createOrder(userId);

    if (!order) throw new NotFoundException(OrderErrors.NOT_FOUND);

    return mapOrderToResponse(order);
  }

  @Patch(':orderId/complete')
  async completeOrder(
    @CurrentUser() { userId }: AuthUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderResponse> {
    const order = await this.orderService.completeOrder(userId, orderId);

    return mapOrderToResponse(order);
  }

  @Patch(':orderId/cancel')
  async cancelOrder(
    @CurrentUser() { userId }: AuthUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<void> {
    await this.orderService.cancelOrder(userId, orderId);
  }
}
