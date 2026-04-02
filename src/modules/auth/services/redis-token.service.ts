import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisTokenService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit(): Promise<void> {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });

    await this.client.connect();
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
