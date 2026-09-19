import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// Set up the database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize database schema
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        player_name VARCHAR(100) NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS journeys (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        completed_regions JSONB DEFAULT '[]',
        answers JSONB DEFAULT '{}',
        score INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database schema initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}
initDb();

// Routes
app.post('/api/score', async (req, res) => {
  const { playerName, score } = req.body;
  if (!playerName || score === undefined) {
    return res.status(400).json({ error: 'Player name and score are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO leaderboard (player_name, score) VALUES ($1, $2) RETURNING *',
      [playerName, score]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).json({ error: 'Failed to save score.' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT player_name, score, created_at FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

app.post('/api/journey', async (req, res) => {
  const { email, name, completed, answers, score } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required.' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO journeys (email, name, completed_regions, answers, score, last_updated)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        completed_regions = EXCLUDED.completed_regions,
        answers = EXCLUDED.answers,
        score = EXCLUDED.score,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `, [email, name, JSON.stringify(completed || []), JSON.stringify(answers || {}), score || 0]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error saving journey:', err);
    res.status(500).json({ error: 'Failed to save journey.' });
  }
});

app.get('/api/journey/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT * FROM journeys WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (err) {
    console.error('Error fetching journey:', err);
    res.status(500).json({ error: 'Failed to fetch journey.' });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
