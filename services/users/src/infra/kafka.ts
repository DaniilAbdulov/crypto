import {
  Kafka,
  Producer,
  Consumer,
  EachMessagePayload,
  Partitioners,
} from 'kafkajs';

type KafkaClientConfig = {
  brokers: string[];
  clientId?: string;
};

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer;
  private consumer?: Consumer;
  private isConnected = false;

  constructor(config: KafkaClientConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId ?? 'kafka-client',
      brokers: config.brokers,
      connectionTimeout: 5000,
      requestTimeout: 10000,
      retry: {
        initialRetryTime: 300,
        retries: 2,
        maxRetryTime: 5000,
      },
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async connectProducer(): Promise<void> {
    if (this.isConnected) return;

    await this.producer.connect();
    this.isConnected = true;
    console.log('[kafka] producer connected');
  }

  async produce(topic: string, message: object): Promise<void> {
    if (!this.isConnected) {
      console.log(
        `[kafka] producer not connected, skipping message to ${topic}`,
      );
      return;
    }

    await this.producer.send({
      topic,
      messages: [{value: JSON.stringify(message)}],
      timeout: 3000,
    });

    console.log(`[kafka] message sent to ${topic}`);
  }

  async subscribe(
    topic: string,
    eachMessage: (payload: EachMessagePayload) => Promise<void>,
    groupId: string,
  ): Promise<void> {
    this.consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    await this.consumer.connect();
    await this.consumer.subscribe({topic, fromBeginning: false});

    await this.consumer.run({
      eachMessage: async (payload) => {
        try {
          await eachMessage(payload);
        } catch (err) {
          console.error('[kafka] consumer error', err);
        }
      },
    });

    console.log(`[kafka] subscribed to ${topic}`);
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect().catch(() => {});
    }
    if (this.consumer) {
      await this.consumer.disconnect().catch(() => {});
    }
    this.isConnected = false;
    console.log('[kafka] disconnected');
  }
}
