import path from "path";
import { nanoid } from "nanoid";
import { getRedisClient } from "./redisClients.mjs";
/**
 * Shortens a URL and stores it in Redis with a configurable time-to-live (TTL).
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.body.url - URL to be shortened.
 * @param {number} [req.body.ttl] - "time-to-live" for the shortened URL in seconds (default is 1 hour).
 * @returns {Promise<Object>} - JSON object containing the shortened URL and the original URL.
 */
export async function shortenUrl(req, res) {
    if (!req.body?.origin) {
        console.error("FIX: No Origin Url found");
        return;
    }

    if (!req.body?.url) {
        return res.status(400).send("URL is required");
    }

    try {
        let shortId = nanoid();
        let redisClient = await getRedisClient(shortId);

        await redisClient.set(
            shortId,
            req.body.url,
            "EX", // seconds
            req.body?.ttl || 3600
        );

        let shortUrlPath = path.join(req.body.origin, shortId);

        return res.json({
            shortUrl: shortUrlPath,
            originalUrl: req.body.url,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).send("Failed to shorten URL");
    }
}
