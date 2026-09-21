import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const usePostgres = Boolean(process.env.DATABASE_URL);
let pool;
if (usePostgres) {
  const { Pool } = pg;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database
async function initDb() {
  if (usePostgres) {
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
          phone VARCHAR(50),
          completed_regions JSONB DEFAULT '[]',
          answers JSONB DEFAULT '{}',
          score INTEGER DEFAULT 0,
          time_taken INTEGER DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      try {
        await pool.query(`ALTER TABLE journeys ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
        await pool.query(`ALTER TABLE journeys ADD COLUMN IF NOT EXISTS time_taken INTEGER DEFAULT 0;`);
      } catch (alterErr) {
        console.log('Columns already exist or error adding them:', alterErr.message);
      }
      console.log('Postgres Database schema initialized.');
    } catch (err) {
      console.error('Error initializing Postgres database:', err);
    }
  } else {
    // JSON Fallback
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify({ leaderboard: [], journeys: [] }));
      console.log('Local JSON database initialized.');
    }
  }
}
initDb();

async function readJsonDb() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { leaderboard: [], journeys: [] };
  }
}

async function writeJsonDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.post('/api/score', async (req, res) => {
  const { playerName, score } = req.body;
  if (!playerName || score === undefined) {
    return res.status(400).json({ error: 'Player name and score are required.' });
  }

  if (usePostgres) {
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
  } else {
    const db = await readJsonDb();
    const entry = { id: Date.now(), player_name: playerName, score, created_at: new Date().toISOString() };
    db.leaderboard.push(entry);
    await writeJsonDb(db);
    res.json(entry);
  }
});

app.get('/api/leaderboard', async (req, res) => {
  if (usePostgres) {
    try {
      const result = await pool.query(
        'SELECT player_name, score, created_at FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT 10'
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      res.status(500).json({ error: 'Failed to fetch leaderboard.' });
    }
  } else {
    const db = await readJsonDb();
    const sorted = db.leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.created_at) - new Date(b.created_at);
    }).slice(0, 10);
    res.json(sorted);
  }
});

app.post('/api/journey', async (req, res) => {
  const { email, name, phone, completed, answers, score, timeTaken } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required.' });
  }

  if (usePostgres) {
    try {
      const result = await pool.query(`
        INSERT INTO journeys (email, name, phone, completed_regions, answers, score, time_taken, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          completed_regions = EXCLUDED.completed_regions,
          answers = EXCLUDED.answers,
          score = EXCLUDED.score,
          time_taken = EXCLUDED.time_taken,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
      `, [email, name, phone || null, JSON.stringify(completed || []), JSON.stringify(answers || {}), score || 0, timeTaken || 0]);
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Error saving journey:', err);
      res.status(500).json({ error: 'Failed to save journey.' });
    }
  } else {
    const db = await readJsonDb();
    const existingIdx = db.journeys.findIndex(j => j.email === email);
    const newJourney = {
      email, name, phone: phone || null, completed_regions: completed || [], answers: answers || {}, score: score || 0, time_taken: timeTaken || 0, last_updated: new Date().toISOString()
    };
    if (existingIdx !== -1) {
      db.journeys[existingIdx] = newJourney;
    } else {
      db.journeys.push(newJourney);
    }
    await writeJsonDb(db);
    res.json({ success: true, data: newJourney });
  }
});

app.get('/api/journey/:email', async (req, res) => {
  const { email } = req.params;
  if (usePostgres) {
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
  } else {
    const db = await readJsonDb();
    const journey = db.journeys.find(j => j.email === email);
    if (journey) {
      res.json({ success: true, data: journey });
    } else {
      res.status(404).json({ success: false, message: 'Not found' });
    }
  }
});

app.get('/api/admin/users', async (req, res) => {
  if (usePostgres) {
    try {
      const result = await pool.query(`
        SELECT email, name, phone, completed_regions, score, time_taken, last_updated 
        FROM journeys 
        ORDER BY jsonb_array_length(completed_regions) DESC, time_taken ASC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      res.status(500).json({ error: 'Failed to fetch admin users.' });
    }
  } else {
    const db = await readJsonDb();
    const sorted = db.journeys.sort((a, b) => {
      const aLen = a.completed_regions.length;
      const bLen = b.completed_regions.length;
      if (aLen !== bLen) return bLen - aLen;
      return (a.time_taken || 0) - (b.time_taken || 0);
    });
    res.json(sorted);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} - Database: ${usePostgres ? 'Postgres' : 'Local JSON'}`);
});
