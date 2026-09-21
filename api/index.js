const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');

const app = express();
app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL || 'postgresql://user:password@localhost/db');

app.post('/api/journey', async (req, res) => {
  const { email, name, phone, completed, answers, score, timeTaken } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try {
    const result = await sql`
      INSERT INTO journeys (email, name, phone, completed_regions, answers, score, time_taken, last_updated)
      VALUES (${email}, ${name}, ${phone || null}, ${JSON.stringify(completed || [])}, ${JSON.stringify(answers || {})}, ${score || 0}, ${timeTaken || 0}, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        completed_regions = EXCLUDED.completed_regions,
        answers = EXCLUDED.answers,
        score = EXCLUDED.score,
        time_taken = EXCLUDED.time_taken,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `;
    res.json({ success: true, data: result[0] });
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

module.exports = app;
