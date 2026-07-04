import express from 'express';
import cors from 'cors';
import { verifyUnityToken } from "./middleware/auth.js";
const app = express();

app.use(cors());
app.use(express.json());

const players = [];

app.get('/health', (req, res) => {
  res.status(200).send("OK; Server is running");
});

app.get('/me', verifyUnityToken,  (req, res) => {
  res.json({
    playerId: req.playerId,
    name: "player",
    level: 1,
    coins: 200
  })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});