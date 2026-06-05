# Sistema Integrado Sulnet v45

Versão robusta para Railway. Corrige erro comum de variáveis coladas com `NOME=valor`.

## Variáveis corretas na Railway

Use estes nomes:

```env
GOOGLE_CALENDAR_CLIENT_ID=786355285772-0hujrij5hpadrddjq9konaci7825ljr8.apps.googleusercontent.com
GOOGLE_AUTHORIZED_ORIGINS=http://localhost:3000,https://sistema-integrado-crm-production.up.railway.app
```

Também aceita temporariamente os nomes em português:

```env
ID_DO_CLIENTE_DO_CALENDARIO_DO_GOOGLE=786355285772-0hujrij5hpadrddjq9konaci7825ljr8.apps.googleusercontent.com
ORIGENS_AUTORIZADAS_DO_GOOGLE=http://localhost:3000,https://sistema-integrado-crm-production.up.railway.app
```

Mas o recomendado é usar os nomes em inglês.

## Diagnóstico

Depois do deploy, abra:

```text
https://sistema-integrado-crm-production.up.railway.app/api/config
```

O retorno precisa mostrar:

```json
"googleCalendarConfigured": true,
"googleClientIdLooksValid": true
```

Se `googleClientIdLooksValid` for `false`, a variável do Client ID está errada.

## Google Cloud

No OAuth Client do Google Cloud, adicione em Authorized JavaScript origins:

```text
https://sistema-integrado-crm-production.up.railway.app
```

Sem barra final, sem `/#/agenda`.

## Rodar localmente

```bash
node server.js
```

Abra:

```text
http://localhost:3000
```
