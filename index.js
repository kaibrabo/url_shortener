import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { getOriginalUrl } from "./classes/originalUrl.mjs";
import { shortenUrl } from "./classes/shortenUrl.mjs";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ENDPOINTS

// GET home
app.get("/", (_req, res) => res.sendFile("/index.html"));

// GET original url
app.get("/:shortId", (req, res) => getOriginalUrl(req, res));

// POST shorten url
app.post("/shorten", (req, res) => shortenUrl(req, res));

// GO LIVE
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});
