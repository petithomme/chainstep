const NodeCache = require( "node-cache" );

export class Cache {

    private static _instance: Cache;

    private nodeCache = new NodeCache();

    public static get instance(): Cache {
        if (!Cache._instance) {
            Cache._instance = new Cache();
        }
        return Cache._instance;
    }

    public get(key: string): any {
        return this.nodeCache.get(key);
    }

    public set(key: string, value: string): void {
        this.nodeCache.set(key, value);
    }

}
