import { createClient } from 'redis';

export class RedisFactory {
    private client: any;

    constructor(url: string) {
        this.client = createClient({
            url: url
        });
        this.client.connect();
    }

    public setValue(key: string, value: any) {
        this.client.set(key, value);
    }

    public async getValue(key: string) :Promise<any> {
        return this.client.get(key);
    }
}