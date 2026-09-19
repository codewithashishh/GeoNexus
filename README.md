# GeoNexus — SIH26018 Prototype

Beginner-friendly React + Node/Express prototype for:
**Intelligent Land Record Digitization and Validation System**

This is a hackathon prototype using synthetic/demo land-record data. OCR is simulated and clearly labelled in the UI.

## Requirements
- Node.js 18+
- VS Code
- PostgreSQL is optional for this ready-to-run demo. The app uses an in-memory store by default so the complete flow works immediately.

## Run in VS Code

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs on:
http://localhost:5000

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
http://localhost:5173

Open the frontend URL in your browser.

## Demo
1. Click **Process New Record**
2. Upload any JPG/PNG/PDF or click **Load Sample Land Record**
3. Watch the processing pipeline
4. Review extracted values and confidence
5. Run validation
6. Correct/verify low-confidence fields
7. Save the verified record
8. View it on the Dashboard / Records page

## MVC Structure

backend/
- controllers/
- models/
- routes/
- services/
- middleware/
- app.js
- server.js

frontend/
- src/components/
- src/pages/
- src/services/
- App.jsx

## PostgreSQL
The prototype intentionally defaults to an in-memory repository to make the hackathon demo reliable with zero database setup.

The backend model layer is isolated in:
`backend/models/recordModel.js`

It can be replaced with a PostgreSQL implementation later without changing the React flow.

**Important:** Use synthetic/demo records only. This is not a production government system.
