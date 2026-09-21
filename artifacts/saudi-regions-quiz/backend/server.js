import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL || 'postgresql://user:password@localhost/db');

// Initialize database table
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS journeys (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        completed_regions JSONB DEFAULT '[]',
        answers JSONB DEFAULT '{}',
        score INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Add columns if they don't exist
    await sql`ALTER TABLE journeys ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`;
    await sql`ALTER TABLE journeys ADD COLUMN IF NOT EXISTS time_taken INTEGER DEFAULT 0`;
    
    console.log('Database table initialized.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

initDB();

app.post('/api/journey', async (req, res) => {
  const { email, name, phone, completed, answers, score, timeTaken } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try {
    await sql`
      INSERT INTO journeys (email, name, phone, completed_regions, answers, score, time_taken, last_updated)
      VALUES (${email}, ${name}, ${phone || null}, ${JSON.stringify(completed)}, ${JSON.stringify(answers)}, ${score}, ${timeTaken || 0}, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        completed_regions = EXCLUDED.completed_regions,
        answers = EXCLUDED.answers,
        score = EXCLUDED.score,
        time_taken = EXCLUDED.time_taken,
        last_updated = CURRENT_TIMESTAMP
    `;
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving journey:', error);
    res.status(500).json({ error: 'Failed to save journey' });
  }
});

app.get('/api/journey/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await sql`
      SELECT * FROM journeys WHERE email = ${email}
    `;
    
    if (result.length > 0) {
      res.json({ success: true, data: result[0] });
    } else {
      res.status(404).json({ success: false, message: 'Not found' });
    }
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ error: 'Failed to fetch journey' });
  }
});

const PORT = process.env.PORT || 3001;

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM journeys 
      ORDER BY score DESC, time_taken ASC
    `;
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
