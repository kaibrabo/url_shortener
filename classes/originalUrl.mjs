import { getRedisClient } from "./redisClients.mjs";

/**
 * Retrieves the original URL for the given short ID from Redis.
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {string} req.params.shortId - short ID to look up.
 * @returns {Promise<Object>} - Redirect to the original URL if found, or an error message if not found.
 */
export async function getOriginalUrl(req, res) {
    if (!req.params?.shortId) {
        return res.status(400).send("ID is not found");
    }

    try {
        let redisClient = await getRedisClient(req.params.shortId);
        
        let url = await redisClient.get(req.params.shortId);

        if (!url) {
            console.log("- cache miss:\n", "\tid", req.params.shortId);

            return res.status(400).send("ID Not Found");
        }

        console.log("- cache hit:\n", "\tid", req.params.shortId, "url", url);

        return res.redirect(url);
    } catch (err) {
        console.error(err);

        return res.status(404).send("URL not found");
    }
}