import { Injectable, Logger } from '@nestjs/common';
import { PaymentOrderMessage } from '../payment-queue.interface.js';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service.js';

export interface DLQMessage {
  content: PaymentOrderMessage;
  properties: {
    messageId?: string;
    timestemp?: number;
    headers?: Record<string, unknown>;
  };
  deathInfo?: {
    reason: string;
    queue: string;
    time: Date;
    count: number;
    exchange: string;
    routingKeys: string[];
  };
}

export interface DLQStatus {
  queueName: string;
  messageCount: number;
  consumerCount: number;
}

@Injectable()
export class DlqService {
  private readonly logger = new Logger(DlqService.name);

  private readonly DLQ_NAME = 'payment_queue.dlq';
  private readonly EXCHANGE = 'payments';
  private readonly ROUTING_KEY = 'payment.order';

  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async getStart(): Promise<DLQStatus> {
    const channel = this.rabbitmqService.getChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }

    const queueInfo = await channel.checkQueue(this.DLQ_NAME);

    return {
      queueName: this.DLQ_NAME,
      messageCount: queueInfo.messageCount,
      consumerCount: queueInfo.consumerCount,
    };
  }

  async peekMessages(limit: number = 10): Promise<DLQMessage[]> {
    const channel = this.rabbitmqService.getChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel not available');
    }

    const messages: DLQMessage[] = [];

    await channel.checkQueue(this.DLQ_NAME);

    for (let i = 0; i < limit; )
  }
}
