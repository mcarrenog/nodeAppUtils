import {RedisFactory} from "../factories/RedisFactory";

export class ParameterComponent {

    private readonly redisFactory: RedisFactory;

    constructor(url: string) {
        this.redisFactory = new RedisFactory(url)
    }

    public setValue(key: string, value: any) {
        this.redisFactory.setValue(key, value);
    }

    public async getValue(key: string): Promise<any> {
        return this.redisFactory.getValue(key);
    }

}