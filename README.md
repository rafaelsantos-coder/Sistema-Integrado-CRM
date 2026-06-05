# Sistema Integrado Sulnet

Projeto preparado para GitHub e Railway.

## Rodar localmente

```bash
npm install
npm start
```

Abra:

```text
http://localhost:3000
```

No Windows, pode usar:

```text
INICIAR_LOCAL.bat
```

## Variáveis de ambiente

Configure localmente ou na Railway:

```env
GOOGLE_CALENDAR_CLIENT_ID=SEU_CLIENT_ID.apps.googleusercontent.com
GOOGLE_AUTHORIZED_ORIGINS=http://localhost:3000,https://SEU-APP.up.railway.app
```

O `client_secret` do Google não deve ficar no front-end e não foi incluído no projeto.

## Subir para GitHub

```bash
git init
git add .
git commit -m "Sistema Integrado Sulnet v43"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/sistema-integrado-sulnet.git
git push -u origin main
```

## Publicar na Railway

1. Crie um novo projeto na Railway.
2. Escolha **Deploy from GitHub Repo**.
3. Selecione este repositório.
4. Configure as variáveis:
   - `GOOGLE_CALENDAR_CLIENT_ID`
   - `GOOGLE_AUTHORIZED_ORIGINS`
5. Deploy.

## Google Calendar

Quando a Railway gerar a URL pública, adicione essa URL no Google Cloud Console em:

**APIs e Serviços > Credenciais > OAuth Client > Authorized JavaScript origins**

Exemplo:

```text
https://sistema-integrado-sulnet.up.railway.app
```

Depois configure na Railway:

```env
GOOGLE_AUTHORIZED_ORIGINS=http://localhost:3000,https://sistema-integrado-sulnet.up.railway.app
```

## Importante para produção real

Esta versão salva dados no navegador/localStorage. Para produção com vários usuários usando a mesma base, o próximo passo é criar banco de dados e API com autenticação server-side.
