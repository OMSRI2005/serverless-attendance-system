# Attendly Frontend

React + Vite employee and admin UI for the Serverless Attendance System.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The supplied environment example uses the confirmed API Gateway endpoint. If `VITE_API_BASE_URL` is empty, attendance remains clearly labelled demo mode and cannot upload images.

## Backend integration

The employee capture flow detects JPEG/PNG bytes, calls `POST /generate-presigned-url` with only `{ contentType }`, validates the returned `incoming-captures/` key, and uploads the binary directly to the returned S3 URL with `PUT`. No AWS credentials are included.

Admin records use `GET /attendance` with only the confirmed combinations: `employee_id` + `date`, `status` + `date`, or `status` alone. Date-range filtering is intentionally disabled until the backend team confirms its query format.

Recognition remains pending after upload until Sushant supplies its endpoint contract. The UI does not invent recognition or attendance results.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create the production build
- `npm run lint` — run the project linter
