# Zealthy EMR - Mini EMR and Patient Portal

A full-stack Electronic Medical Records (EMR) system with a patient portal built with Next.js, TypeScript, Prisma, and SQLite.

## Features

### Mini EMR (Admin Interface - `/admin`)
- View all patients in a table with at-a-glance data
- Create new patients with credentials
- Drill down into individual patient records
- Manage patient appointments (CRUD operations)
- Manage patient prescriptions (CRUD operations)
- Support for recurring appointments with end dates
- No authentication required (as specified)

### Patient Portal (`/`)
- Secure login with email and password
- Dashboard showing:
  - Patient information
  - Appointments within next 7 days
  - Medication refills within next 7 days
- View all appointments (next 3 months)
- View all prescriptions (next 3 months)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: Cookie-based sessions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd zealthy-emr
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
```

4. Seed the database with sample data:
```bash
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

- **Email**: john.doe@example.com
- **Password**: password123

Or:
- **Email**: jane.smith@example.com
- **Password**: password123

## Project Structure

```
zealthy-emr/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding script
├── src/
│   ├── app/
│   │   ├── admin/         # EMR admin interface
│   │   ├── portal/        # Patient portal
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Login page
│   └── lib/
│       ├── prisma.ts      # Prisma client
│       └── auth.ts        # Authentication utilities
└── package.json
```

## API Routes

- `POST /api/auth/login` - Patient login
- `POST /api/auth/logout` - Patient logout
- `GET /api/auth/me` - Get current patient
- `GET /api/patients` - Get all patients or single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients` - Update patient
- `GET /api/appointments` - Get appointments by patient
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments` - Update appointment
- `DELETE /api/appointments` - Delete appointment
- `GET /api/prescriptions` - Get prescriptions by patient
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions` - Update prescription
- `DELETE /api/prescriptions` - Delete prescription

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

Note: For production, consider using PostgreSQL instead of SQLite. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Other Platforms

The app can be deployed to:
- Netlify
- Railway
- Fly.io
- AWS (Amplify, EC2, ECS)
- Azure
- Google Cloud

## Database Schema

### Patient
- id, firstName, lastName, email, password
- dateOfBirth, phone, address
- Relations: appointments[], prescriptions[]

### Appointment
- id, patientId, providerName
- dateTime, repeatSchedule, endDate

### Prescription
- id, patientId, medicationName
- dosage, quantity, refillDate, refillSchedule

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema changes
npm run db:push

# Seed database
npm run db:seed
```

## License

MIT
