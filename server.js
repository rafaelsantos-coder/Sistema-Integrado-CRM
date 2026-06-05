const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID || '';
const GOOGLE_AUTHORIZED_ORIGINS = process.env.GOOGLE_AUTHORIZED_ORIGINS || '';

function renderIndex() {
  const templatePath = path.join(__dirname, 'public', 'index.template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  return html
    .replaceAll('__GOOGLE_CALENDAR_CLIENT_ID__', GOOGLE_CLIENT_ID)
    .replaceAll('__GOOGLE_AUTHORIZED_ORIGINS__', GOOGLE_AUTHORIZED_ORIGINS);
}

app.disable('x-powered-by');

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

app.get('*', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderIndex());
});

app.listen(PORT, () => {
  console.log(`Sistema Integrado Sulnet rodando na porta ${PORT}`);
});
