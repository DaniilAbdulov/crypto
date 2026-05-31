import Redis, {RedisOptions} from 'ioredis';

type RedisConfig = {
  url: string;
  maxConnectAttempts?: number;
};

export class RedisClient {
  private client?: Redis;
  private attempts = 0;
  private maxConnectAttempts: number;
  private enabled = true;

  constructor(config: RedisConfig) {
    this.maxConnectAttempts = config.maxConnectAttempts ?? 5;

    const options: RedisOptions = {
      maxRetriesPerRequest: 0,
      lazyConnect: true,
    };

    try {
      this.client = new Redis(config.url, options);
      this.setupEvents();
    } catch (err) {
      console.error('[redis] disabled:', err);
      this.enabled = false;
    }
  }

  private setupEvents() {
    if (!this.client) return;

    this.client.on('connect', () => {
      console.log('[redis] connecting...');
    });

    this.client.on('ready', () => {
      this.attempts = 0;
      this.enabled = true;
      console.log('[redis] ready');
    });

    this.client.on('error', (err) => {
      console.error('[redis] error:', err.message);
      this.attempts++;
      if (this.attempts >= this.maxConnectAttempts) {
        console.error(
          '[redis] max connect attempts reached → fallback to no-cache mode',
        );
        this.enabled = false;
      }
    });
  }

  async connect() {
    if (!this.client || !this.enabled) return;

    try {
      await this.client.connect();
    } catch (err) {
      console.error('[redis] connect failed → fallback to no-cache mode');
      this.enabled = false;
    }
  }

  async get(key: string) {
    if (!this.client || !this.enabled) return null;
    try {
      const res = await this.client.get(key);
      return res ? JSON.parse(res) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number) {
    if (!this.client || !this.enabled) return;
    try {
      const payload = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.set(key, payload, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, payload);
      }
    } catch {
      // silent fail
    }
  }
}
