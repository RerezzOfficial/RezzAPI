const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios')
const cheerio = require("cheerio")
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const path = require('path');

const { pinterest } = require('./lib/scraper')

const creator = 'Rerezz Official'

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(publicDir));

const pool = new Pool({
  connectionString: 'postgresql://database_owner:npg_6AP5GDgZeasl@ep-blue-dream-a5z0tre8-pooler.us-east-2.aws.neon.tech/database',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  statement_timeout: 60000,
  max: 10, 
  keepAlive: true
});



(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      email TEXT,
      password TEXT,
      apikey TEXT UNIQUE,
      quota INTEGER DEFAULT 2000,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      otp INTEGER NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `);
})();

async function auth(req, res, next) {
  const token = req.cookies.sessionToken || req.headers['authorization'];
  if (!token) return res.redirect('/auth/login');

  const result = await pool.query(`
    SELECT users.* FROM sessions
    JOIN users ON sessions.user_id = users.id
    WHERE sessions.id = $1
  `, [token]);

  const user = result.rows[0];
  if (!user) {
    res.clearCookie('sessionToken');
    return res.redirect('/auth/login');
  }

  req.user = user;
  next();
}

function guest(req, res, next) {
  const token = req.cookies.sessionToken || req.headers['authorization'];
  if (token) return res.redirect('/dashboard');
  next();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/dashboard', auth, (req, res) => {
  res.sendFile(path.join(publicDir, 'dashboard.html'));
});

app.get('/profile', auth, (req, res) => {
  res.sendFile(path.join(publicDir, 'profile.html'));
});

app.get('/auth/login', guest, (req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

app.get('/auth/register', guest, (req, res) => {
  res.sendFile(path.join(publicDir, 'register.html'));
});

app.get('/auth/forgot-password', (req, res) => {
  res.sendFile(path.join(publicDir, 'forgot.html'));
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Semua field harus diisi!' });
  }

  try {
    const usernameCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan!' });
    }

    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah digunakan!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const apikey = crypto.randomBytes(5).toString('hex');
    const quota = 2000;

    await pool.query(
      'INSERT INTO users (username, email, password, apikey, quota) VALUES ($1, $2, $3, $4, $5)',
      [username, email, hashedPassword, apikey, quota]
    );

    res.json({ success: true, message: 'Registrasi sukses!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat registrasi!' });
  }
});

app.post('/api/login', guest, async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

  const user = result.rows[0];
  if (user && await bcrypt.compare(password, user.password)) {
    const sessionId = crypto.randomUUID();
    await pool.query('INSERT INTO sessions (id, user_id) VALUES ($1, $2)', [sessionId, user.id]);

    res.cookie('sessionToken', sessionId, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, redirect: '/dashboard' });
  } else {
    res.status(401).json({ success: false, message: 'Username/password salah' });
  }
});

app.post('/api/logout', auth, async (req, res) => {
  const token = req.cookies.sessionToken || req.headers['authorization'];
  await pool.query('DELETE FROM sessions WHERE id = $1', [token]);
  res.clearCookie('sessionToken');
  res.json({ success: true, redirect: '/auth/login' });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rerezzofficial@gmail.com',
    pass: 'kpwz wfph ffml gcyk' 
  }
});

app.post('/api/reset-password/request', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email harus diisi!' });
  }

  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Email tidak ditemukan!' });
    }

    const userId = result.rows[0].id;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'INSERT INTO password_resets (user_id, otp, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET otp = $2, expires_at = $3',
      [userId, otp, expiresAt]
    );

    const mailOptions = {
      from: 'rerezzofficial@gmail.com',
      to: email,
      subject: 'Reset Password OTP',
      text: `Kode OTP Anda adalah: ${otp}. Kode ini berlaku selama 10 menit.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'OTP telah dikirim ke email Anda!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengirim OTP!' });
  }
});

app.post('/api/reset-password/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Semua field harus diisi!' });
    }
  
    try {
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Email tidak ditemukan!' });
      }
  
      const userId = userResult.rows[0].id;
  
      const otpResult = await pool.query(
        'SELECT otp, expires_at FROM password_resets WHERE user_id = $1',
        [userId]
      );
  
      if (otpResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'OTP tidak valid!' });
      }
  
      const storedOtp = otpResult.rows[0].otp;
      const expiresAt = otpResult.rows[0].expires_at;
  
      if (Date.now() > expiresAt.getTime()) {
        return res.status(400).json({ success: false, message: 'OTP telah kedaluwarsa!' });
      }
  
      if (parseInt(otp) !== storedOtp) {
        return res.status(400).json({ success: false, message: 'OTP salah!' });
      }
  
      res.json({ success: true, message: 'OTP berhasil diverifikasi!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memverifikasi OTP!' });
    }
  });
  
  app.post('/api/reset-password/reset', async (req, res) => {
    const { email, newPassword } = req.body;
  
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Semua field harus diisi!' });
    }
  
    try {
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Email tidak ditemukan!' });
      }
  
      const userId = userResult.rows[0].id;
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
  
      await pool.query('DELETE FROM password_resets WHERE user_id = $1', [userId]);
  
      res.json({ success: true, message: 'Password berhasil direset!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mereset password!' });
    }
  });

app.get('/api/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, apikey, quota, created_at 
      FROM users WHERE id = $1
    `, [req.user.id]);

    res.json({ success: true, user: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengambil profile' });
  }
});

app.post('/api/profile/update-apikey', auth, async (req, res) => {
    try {
        const { newApiKey } = req.body;

        if (!newApiKey || newApiKey.trim() === '') {
            return res.status(400).json({ success: false, message: 'New API Key is required.' });
        }

        const userId = req.user.id;

        const result = await pool.query(
            'UPDATE users SET apikey = $1 WHERE id = $2 RETURNING *',
            [newApiKey.trim(), userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({
            success: true,
            message: 'API Key updated successfully.',
            data: { apikey: result.rows[0].apikey }
        });
    } catch (error) {
        console.error('Error updating API Key:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the API Key.' });
    }
});

//=====[ SYSTEM DATABSE ]=====//
async function ping(name, status) {
  const statusParam = status ? 'true' : 'false';
  const url = `https://api-im-rerezz.glitch.me/request-ping?name=${encodeURIComponent(name)}&${statusParam}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Gagal memanggil API', error: err.message };
  }
}

async function request() {
  try {
    const response = await fetch('https://api-im-rerezz.glitch.me/request');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Gagal memanggil request API:', error);
    return { success: false, message: 'Error memanggil request API' };
  }
}

async function UPDATE(apikey) {
  try {
    const userResult = await pool.query('SELECT id, quota FROM users WHERE apikey = $1', [apikey]);
    if (userResult.rows.length === 0) {
      return { success: false, message: 'Pengguna dengan API Key ini tidak ditemukan!' };
    }
    const userId = userResult.rows[0].id;
    let currentQuota = userResult.rows[0].quota;
    if (currentQuota <= 0) {
      return { success: false, message: 'Kuota pengguna sudah habis!' };
    }
    currentQuota -= 1;
    await pool.query('UPDATE users SET quota = $1 WHERE id = $2', [currentQuota, userId]);
    await request();
    return { success: true, message: 'Kuota pengguna berhasil dikurangi.', remainingQuota: currentQuota };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Terjadi kesalahan saat mengurangi kuota!' };
  }
}
app.get('/api/testing', async (req, res) => {
  const { apikey } = req.query;
  if (!apikey || apikey.trim() === '') {
    await ping('api/testing', false);
    return res.status(400).json({ success: false, message: 'API Key harus diisi!' });
  }

  const result = await decreaseQuota(apikey);

  if (result.success) {
    await ping('api/testing', true);
    res.json(result);
  } else {
    await ping('api/testing', false);
    res.status(400).json(result);
  }
});

module.exports = {
  UPDATE,
  ping
};


app.use('/api/islami', require('./api/islami'));
app.use('/api/search', require('./api/search'));
app.use('/api/anime', require('./api/anime'));

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
