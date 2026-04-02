import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { BookModule } from '@/modules/book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), BookModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
