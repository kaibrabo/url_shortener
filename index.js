import redis from "redis";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

// handling reconnections
const reconStrat = (retries) => {
    if (retries < 20) {
        return retries * 500;
    }

    console.log(
        "Too many attempts to reconnect. Redis connection was terminated"
    );

    return new Error("Too many retries.");
};

const redisClients = [
    redis.createClient({
        host: process.env.REDIS_HOST_1,
        port: process.env.REDIS_PORT_1,
        socket: {
            reconnectStrategy: reconStrat(),
            connectTimeout: 10000, // ms
        },
    }),
    redis.createClient({
        host: process.env.REDIS_HOST_2,
        port: process.env.REDIS_PORT_2,
        socket: {
            reconnectStrategy: reconStrat(),
            connectTimeout: 10000,
        },
    }),
    redis.createClient({
        host: process.env.REDIS_HOST_3,
        port: process.env.REDIS_PORT_3,
        socket: {
            reconnectStrategy: reconStrat(),
            connectTimeout: 10000,
        },
    }),
];

// set client error handling
redisClients.map((client) => {
    client.on("error", (err) => console.log("Redis Client Error:", err));

    return client;
});

// ENDPOINTS

// GET home
app.get("/", (req, res) => res.send("Hello World!"));

// GET original url
app.get("/:shortId", (req, res) => getOriginalUrl(req, res));

// POST shorten url
app.post("/shorten", (req, res) => shortenUrl(req, res));

// GO LIVE
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});

// HELPERS
function getRedisClient(key) {
    let accum = (acc, char) => acc + char.charCodeAt(0);
    let hash = key.split("").reduce(accum, 0);
    let mod = hash % redisClients.length;

    return redisClients[mod];
}

async function getOriginalUrl(req, res) {
    let redisClient = getRedisClient(req.params.shortId);

    await redisClient.connect();

    redisClient.get(shortId, (err, url) => {
        if (err || !url) {
            return res.status(400).send("ID Not Found");
        }

        return res.redirect(url);
    });
}

async function shortenUrl(req, res) {
    if (!req.body?.url) {
        return res.status(400).send("URL is required");
    }

    let shortId = nanoid();
    let redisClient = getRedisClient(shortId);

    await redisClient.connect();

    // "EX" = seconds, ttl = (time-to-live), default 1 hour to invalidate cache
    await redisClient.set(shortId, req.body.url, "EX", req.body?.ttl || 3600);

    return res.json({
        shortUrl: `http://localhost:${process.env.PORT}/${shortId}`,
    });
}
