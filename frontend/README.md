# Attendly Frontend

Premium HRMS attendance portal for the Serverless Attendance System.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

For PowerShell, copy the environment file with `Copy-Item .env.example .env`.

## Environment

`VITE_API_BASE_URL` should point to the backend API. The frontend calls `POST /generate-presigned-url`, then uploads the captured JPEG directly to the returned S3 `uploadUrl` with `PUT`.

When the API base URL is not configured, attendance submission uses a local mock upload delay so the UI can be reviewed without AWS credentials. No credentials or production endpoints are stored in the frontend.

Recognition remains intentionally separate from upload because the S3 event triggers asynchronous AWS Rekognition processing. The placeholder is `src/services/api.js#getRecognitionResult`; it can be connected when the backend result contract is available.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run lint` — run the project linter

## Routes

- `/login` — employee/admin access selection and validation
- `/admin` — dashboard overview, metrics, chart, and activity
- `/employee` — webcam capture and attendance upload workflow
- `/records` — searchable and filterable attendance history
