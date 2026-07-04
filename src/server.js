import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: "ok", message: "Rec Me backend is running"});
});

const PORT = process.env.PORT || 3000;
app.use(PORT, () => {
  console.log("App is running on" + PORT);
});