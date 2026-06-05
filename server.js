const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID || '';
const GOOGLE_AUTHORIZED_ORIGINS = process.env.GOOGLE_AUTHORIZED_ORIGINS || '';

// In-memory session store: token -> { userId, email, name, picture, exp }
const sessions = new Map();

function generateToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

function verifyGoogleToken(idToken) {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const payload = JSON.parse(data);
          if (payload.error) return reject(new Error(payload.error_description || payload.error));
          if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
            return reject(new Error('Token audience mismatch'));
          }
          resolve(payload);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function renderIndex() {
  const templatePath = path.join(__dirname, 'public', 'index.template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  return html
    .replaceAll('__GOOGLE_CALENDAR_CLIENT_ID__', GOOGLE_CLIENT_ID)
    .replaceAll('__GOOGLE_AUTHORIZED_ORIGINS__', GOOGLE_AUTHORIZED_ORIGINS);
}

app.disable('x-powered-by');
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    app: 'Sistema Integrado Sulnet',
    version: 'v43',
    googleCalendarConfigured: Boolean(GOOGLE_CLIENT_ID)
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    googleCalendarConfigured: Boolean(GOOGLE_CLIENT_ID),
    authorizedOrigins: GOOGLE_AUTHORIZED_ORIGINS
  });
});

// POST /api/auth/google — validate Google ID token and create a session
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) {
    return res.status(400).json({ ok: false, error: 'Missing credential' });
  }
  try {
    const payload = await verifyGoogleToken(credential);
    const token = generateToken();
    const exp = Date.now() + 8 * 60 * 60 * 1000; // 8-hour session
    sessions.set(token, {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
      exp,
    });
    // Clean up expired sessions opportunistically
    for (const [k, v] of sessions) {
      if (v.exp < Date.now()) sessions.delete(k);
    }
    res.json({
      ok: true,
      token,
      user: { email: payload.email, name: payload.name, picture: payload.picture },
    });
  } catch (err) {
    console.error('Google token verification failed:', err.message);
    res.status(401).json({ ok: false, error: 'Token inválido ou expirado' });
  }
});

// GET /api/auth/user — return current session user
app.get('/api/auth/user', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const session = token ? sessions.get(token) : null;
  if (!session || session.exp < Date.now()) {
    return res.status(401).json({ ok: false, error: 'Not authenticated' });
  }
  res.json({ ok: true, user: { email: session.email, name: session.name, picture: session.picture } });
});

// POST /api/auth/logout — destroy session
app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

app.get('*', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderIndex());
});

app.listen(PORT, () => {
  console.log(`Sistema Integrado Sulnet rodando na porta ${PORT}`);
});
