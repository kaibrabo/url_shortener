import redis from "redis";

// multiple redis instances for distributed cache
const redisClients = [
    redis.createClient({
        host: process.env.REDIS_HOST_1,
        port: process.env.REDIS_PORT_1,
        socket: {
            reconnectStrategy: (retries) => reconStrat(retries),
            connectTimeout: 10000, // ms
        },
    }),
    redis.createClient({
        host: process.env.REDIS_HOST_2,
        port: process.env.REDIS_PORT_2,
        socket: {
            reconnectStrategy: (retries) => reconStrat(retries),
            connectTimeout: 10000,
        },
    }),
    redis.createClient({
        host: process.env.REDIS_HOST_3,
        port: process.env.REDIS_PORT_3,
        socket: {
            reconnectStrategy: (retries) => reconStrat(retries),
            connectTimeout: 10000,
        },
    }),
];

// client event handling
redisClients.map(async (client) => {
    client.on("ready", async () =>
        console.log("Client", await client.clientId(), "connected.")
    );

    client.on("error", (err) => console.log("Redis Client Error:", err));

    await client.connect();

    return client;
});

// handling reconnections
function reconStrat(retries) {
    if (retries < 20) return retries * 500;

    return new Error("Too many connection attempts, Redis was terminated.");
}

/**
 * Retrieves the appropriate Redis client based on the provided key.
 *
 * @param {string} key - The key to use for selecting the Redis client.
 * @returns {Object} - The Redis client instance that should be used for the given key.
 */
export async function getRedisClient(key) {
    let accum = (acc, char) => acc + char.charCodeAt(0);
    let hash = key.split("").reduce(accum, 0);
    let mod = hash % redisClients.length;

    return redisClients[mod];
}
