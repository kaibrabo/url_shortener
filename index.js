import redis from "redis";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

const redisClients = [
    redis.createClient({ host: process.env.REDIS_HOST_1, port: process.env.REDIS_PORT_1 }),
    redis.createClient({ host: process.env.REDIS_HOST_2, port: process.env.REDIS_PORT_2 }),
    redis.createClient({ host: process.env.REDIS_HOST_3, port: process.env.REDIS_PORT_3 }),
];

// endpoints

// GET home
app.get("/", (req, res) => res.send("Hello World!"))

// GET original url
app.get("/:shortId", (req, res) => getOriginalUrl(req, res));

// POST shorten url
app.post("/shorten", (req, res) => shortenUrl(req, res));

app.listen(process.env.PORT, () => { console.log(`Listening on port: ${process.env.PORT}`) });

// HELPERS
function getRedisClient(key) {
    let accum = (acc, char) => acc + char.charCodeAt(0);
    let hash = key.split("").reduce(accum, 0);
    let mod = hash % redisClients.length;
    return redisClients[mod];
}

async function shortenUrl(req, res) {

    if (!req.body?.url) {
        return res.status(400).send("URL is required");
    }

    let shortId = nanoid();
    let redisClient = getRedisClient(shortId);

    await redisClient.set(shortId, req.body.url);
    
    res.json({ shortUrl: `http://localhost:${process.env.PORT}/${shortId}` });
}

async function getOriginalUrl(req, res) {

    let redisClient = getRedisClient(req.params.shortId);

    redisClient.get(shortId, (err, url) => {

        if (err || !url) {

            return res.status(400).send("ID Not Found");
        }

        res.redirect(url);
    });
}