# Nestori Dev Server

This simple Node/Express server accepts property listings (multipart/form-data) for local development and testing.

Quick start

1. Open a terminal in `server/`:

```powershell
cd c:\Users\hp\Desktop\Nestori\Nestori-main\Nestori-main\server
npm install
npm start
```

2. The server listens on `http://localhost:3000` by default.

Endpoints
- `POST /api/listings` — accepts multipart/form-data; files field name is `images`. Returns JSON with saved listing metadata.
- `GET /api/listings` — returns saved listings (dev only).
- Static files saved under `/uploads/<filename>`.

Notes
- This server is for local development only. For production, replace storage with a robust solution (cloud storage, DB, validation, auth).
