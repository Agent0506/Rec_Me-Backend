import express from 'express';
import cors from 'cors';
import { verifyUnityToken } from "./middleware/auth.js";
const app = express();

app.use(cors());
app.use(express.json());

const players = {};

app.get('/health', (req, res) => {
  res.status(200).send("OK; Server is running");
});

app.get('/me', verifyUnityToken, (req, res) => {
  const id = req.playerId;

  if (!players[id]) {
    players[id] = {
      playerId: id,
      name: "player_" + id.slice(0, 5),
      level: 1,
      coins: 200,
      createdAt: Date.now()
    };
  }

  res.json(players[id]);
});

app.get('/debug/players', (req, res) => {
  res.json(players);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});