// =========================================================
// NOVA IT Company — Backend API
// Express + mysql2 (parameterized queries throughout)
// =========================================================

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ── Database connection pool ──
// ── Database connection pool ──
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'it_company_db',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ── Helpers ──
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactPayload(body) {
  const errors = [];
  const full_name = typeof body.full_name === 'string' ? body.full_name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!full_name || full_name.length < 2) {
    errors.push('الاسم الكامل مطلوب.');
  }
  if (full_name.length > 150) {
    errors.push('الاسم الكامل طويل جداً.');
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push('البريد الإلكتروني غير صالح.');
  }
  if (email.length > 255) {
    errors.push('البريد الإلكتروني طويل جداً.');
  }
  if (!message || message.length < 5) {
    errors.push('نص الرسالة قصير جداً.');
  }

  return { errors, data: { full_name, email, message } };
}

// ── Static Files & Routes ──
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── POST /api/contact ──
app.post('/api/contact', async (req, res) => {
  const { errors, data } = validateContactPayload(req.body || {});

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO contact_messages (full_name, email, message) VALUES (?, ?, ?)',
      [data.full_name, data.email, data.message]
    );

    return res.status(201).json({
      message: 'تم إرسال رسالتك بنجاح!',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error inserting contact message:', err);
    return res.status(500).json({ message: 'حدث خطأ في الخادم. حاول مرة أخرى لاحقاً.' });
  }
});

// ── GET /api/services ──
app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, description, icon_key, sort_order FROM services ORDER BY sort_order ASC, id ASC'
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    return res.status(500).json({ message: 'تعذر تحميل الخدمات.' });
  }
});

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Export for Vercel Serverless
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`NOVA IT server running on http://localhost:${PORT}`);
  });
}