import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisTokenService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}
  private client: RedisClientType;

  async onModuleInit(): Promise<void> {
    this.client = createClient({
      url: this.configService.get<string>('REDIS_URL'),
      socket: {
        connectTimeout: 5000,
      },
    });

    Logger.log('Connecting to Redis...', 'RedisTokenService');

    this.client.on('error', (error) => {
      Logger.error(`Redis error: ${error}`, 'RedisTokenService');
    });

    await this.client.connect();

    Logger.log('Connected to Redis', 'RedisTokenService');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }

  private getKey(userId: number): string {
    return `refresh:${userId}`;
  }

  async setRefreshToken(
    userId: number,
    refreshToken: string,
    ttlSeconds: number,
  ): Promise<void> {
    await this.client.set(this.getKey(userId), refreshToken, {
      EX: ttlSeconds,
    });
  }

  async getRefreshToken(userId: number): Promise<string | null> {
    return await this.client.get(this.getKey(userId));
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    await this.client.del(this.getKey(userId));
  }
}
