import Redis, {RedisOptions} from 'ioredis';

type RedisConfig = {
  url: string;
  maxRetriesPerRequest?: number;
  maxConnectAttempts?: number;
};

export class RedisClient {
  private client: Redis;
  private attempts = 0;
  private maxConnectAttempts: number;

  constructor(config: RedisConfig) {
    this.maxConnectAttempts = config.maxConnectAttempts ?? 5;

    const options: RedisOptions = {
      maxRetriesPerRequest: config.maxRetriesPerRequest ?? 3,
      lazyConnect: true,
    };

    console.log(config);

    this.client = new Redis(config.url, options);

    this.setupEvents();
  }

  private setupEvents() {
    this.client.on('connect', () => {
      this.attempts = 0;
      console.log('[redis] connecting...');
    });

    this.client.on('ready', () => {
      console.log('[redis] ready');
    });

    this.client.on('error', async (err) => {
      console.error('[redis] error:', err.message);

      this.attempts++;

      if (this.attempts >= this.maxConnectAttempts) {
        console.error('[redis] max connect attempts reached');
        await this.client.quit();
      }
    });
  }

  async connect() {
    try {
      await this.client.connect();
      return this.client;
    } catch (err) {
      console.log(err);
      this.attempts++;

      if (this.attempts >= this.maxConnectAttempts) {
        throw new Error('[redis] cannot connect after max attempts');
      }

      throw err;
    }
  }

  getClient() {
    return this.client;
  }

  async disconnect() {
    await this.client.quit();
  }

  async get(key: string) {
    const res = await this.client.get(key);

    return res ? JSON.parse(res) : res;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      return this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    return this.client.set(key, JSON.stringify(value));
  }
}
