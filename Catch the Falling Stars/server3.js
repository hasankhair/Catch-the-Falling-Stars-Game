const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL config
const pool = new Pool({
  user: 'user',       // replace with: whoami
  host: 'localhost',
  database: 'leaderboard',
  password: '',                // leave blank if no password
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Get top 5 scores
app.get('/api/scores', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, score FROM scores ORDER BY score DESC LIMIT 5'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new score
app.post('/api/scores', async (req, res) => {
  const { name, score } = req.body;
  if (typeof name === 'string' && typeof score === 'number') {
    try {
      const trimmed = name.trim().substring(0, 50);
      await pool.query(
        'INSERT INTO scores (name, score) VALUES ($1, $2)',
        [trimmed, score]
      );
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PostgreSQL server running at http://localhost:${PORT}`);
});
