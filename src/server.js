import express from 'express';
import cors from 'cors';
import { verifyUnityToken } from "./middleware/auth.js";
import { pool } from "./db.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send("OK; Server is running");
});

app.get('/me', verifyUnityToken, async (req, res) => {
  const id = req.playerId;

  const result = await pool.query(
    "SELECT * FROM players WHERE player_id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    const newPlayer = await pool.query(
      "INSERT INTO players (player_id, name, level, coins, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, "player_" + id.slice(0, 5), 1, 0, Date.now()]
    );

    return res.json(newPlayer.rows[0]);
  }

  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});