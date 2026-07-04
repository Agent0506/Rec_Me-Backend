import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const players = [];

app.get('/health', (req, res) => {
  res.status(200).send("OK; Server is running");
});

app.get('/me', (req, res) => {
  const id = req.query.id;

  if (!players[id]) {
    players[id] = {
      name : "Player " + id,
      level : 1,
      coins: 200
    };
  }

  res.json(players[id]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});