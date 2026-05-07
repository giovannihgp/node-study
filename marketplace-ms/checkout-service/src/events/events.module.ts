import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentQueueService } from './payment-queue/payment-queue.service';
import { PaymentQueueController } from './payment-queue/payment-queue.controller';

@Module({
  imports: [ConfigModule],
  providers: [RabbitmqService, PaymentQueueService],
  controllers: [PaymentQueueController],
  exports: [RabbitmqService, PaymentQueueService],
})
export class EventsModule {}
