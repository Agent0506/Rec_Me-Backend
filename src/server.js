import express from 'express';
import cors from 'cors';
import rateLimit from "express-rate-limit";

import { verifyUnityToken } from "./middleware/auth.js";
import { pool } from "./db.js"

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors());
app.use(express.json());
app.use(limiter);

app.get('/health', (req, res) => {
  res.status(200).send("OK; Server is running");
});

app.get('/me', verifyUnityToken, async (req, res) => {
  try {
    const id = req.playerId;

    let result = await pool.query(
      "SELECT * FROM players WHERE player_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        "INSERT INTO players (player_id, name, level, coins) VALUES ($1, $2, $3, $4) RETURNING *",
        [id, "player_" + id.slice(0, 5), 1, 0]
      );
    }

    const player = result.rows[0];

    res.json({
      id: player.player_id,
      username: player.name,
      level: player.level
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/player/id', async (req, res) => {
  try {
    const id = req.query.id;

    const result = await pool.query(
      "SELECT * FROM players WHERE player_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Player not found"
      });
    }

    const player = result.rows[0];

    res.json({
      id: player.player_id,
      username: player.name,
      level: player.level
    });
  }
  catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error"
    });
  }
});

app.get('/player', async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      error: "Missing username"
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM players WHERE name = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Player not found"
      });
    }

    const player = result.rows[0];

    res.json({
      id: player.player_id,
      username: player.name,
      level: player.level
    });
  }
  catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
  console.log("DB URL exists:", !!process.env.DATABASE_URL);
});