const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

let leaderboard = [];

app.use(cors());
app.use(express.json());

app.get('/api/scores', (req, res) => {
  leaderboard.sort((a, b) => b.score - a.score);
  res.json(leaderboard.slice(0, 5));
});

app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;
  if (typeof name === 'string' && typeof score === 'number') {
    leaderboard.push({ name: name.trim().substring(0, 20), score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100); // Keep only top 100
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid input' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
