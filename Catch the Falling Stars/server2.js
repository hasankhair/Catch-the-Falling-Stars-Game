const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Create or open database
const db = new sqlite3.Database(path.join(__dirname, 'leaderboard.db'));

app.use(cors());
app.use(express.json());

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL
  )
`);

// GET top 5 scores
app.get('/api/scores', (req, res) => {
  db.all(`SELECT name, score FROM scores ORDER BY score DESC LIMIT 5`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json(rows);
  });
});

// POST a new score
app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;
  if (typeof name === 'string' && typeof score === 'number') {
    const trimmedName = name.trim().substring(0, 20);
    db.run(`INSERT INTO scores (name, score) VALUES (?, ?)`, [trimmedName, score], function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.status(201).json({ success: true, id: this.lastID });
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid input' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ SQLite server running at http://localhost:${PORT}`);
});
