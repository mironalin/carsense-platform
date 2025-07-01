# CarSense Platform

A comprehensive full-stack platform for vehicle diagnostics, maintenance records, and OBD-II data analysis. Built with modern web technologies including TypeScript, React, Hono, and Drizzle ORM.

## 🚗 Overview

The CarSense Platform provides a complete solution for vehicle health monitoring, diagnostic trouble codes (DTCs) analysis, location tracking, and maintenance management. This monorepo contains both the web application and backend API that work together to deliver a seamless vehicle monitoring experience.

### Platform Components

This repository contains:

- 🖥️ **CarSense Web App**: A modern React-based web interface with real-time dashboards, vehicle management, diagnostics visualization, and maintenance tracking
- 🔧 **CarSense API**: A robust backend API built with Hono that handles data storage, authentication, and business logic

### Ecosystem Integration

The CarSense Platform integrates with additional components:

- 📱 **CarSense Android App**: An OBD2 diagnostics mobile application that connects to vehicle systems and sends data to the backend

### Key Features

- 🔧 **Real-time Diagnostics**: Monitor vehicle health with live diagnostic data and DTC analysis
- 📊 **Analytics Dashboard**: Rich data visualization with charts, graphs, and performance metrics
- 🚗 **Vehicle Management**: Comprehensive vehicle profiles with status monitoring and fleet management
- 📍 **Location Tracking**: GPS tracking with interactive maps and historical route visualization
- 🔧 **Maintenance Tracking**: Complete maintenance history with service reminders and scheduling
- 📈 **Sensor Data Analysis**: Real-time sensor monitoring with historical data playback
- 📋 **Data Export**: Flexible data export with configurable columns and formats
- 🔔 **Smart Notifications**: Proactive alerts for maintenance, diagnostics, and system health
- 👥 **Ownership Management**: Vehicle transfer system with request handling
- 🔐 **Secure Authentication**: OAuth integration with GitHub and Google, plus email/password
- 📱 **Responsive Design**: Optimized experience across desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX**: Clean, intuitive interface with dark/light theme support

## 🛠️ Tech Stack

### Frontend (Web App)
- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [TanStack Router](https://tanstack.com/router) for type-safe routing
- **State Management**: [TanStack Query](https://tanstack.com/query) for server state
- **Forms**: [TanStack Form](https://tanstack.com/form) with [Zod](https://zod.dev/) validation
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **Maps**: [Leaflet](https://leafletjs.com/) with [react-leaflet](https://react-leaflet.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **HTTP Client**: [Hono RPC](https://hono.dev/guides/rpc) for type-safe API communication
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development and building

### Backend (API)
- **Runtime**: [Bun](https://bun.sh/) for performance and developer experience
- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/) with OAuth providers (GitHub, Google)
- **Validation**: [Zod](https://zod.dev/) for schema validation and type safety
- **API Documentation**: [OpenAPI](https://www.openapis.org/) specification with Scalar
- **Logging**: [Pino](https://getpino.io/) for structured logging
- **Email**: [React Email](https://react.email/) with [Resend](https://resend.com/)
- **File Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) for image uploads
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/) with edge computing

### Database & Infrastructure
- **Database**: PostgreSQL hosted on [Neon](https://neon.tech/)
- **Migrations**: Drizzle Kit for database schema management
- **Package Manager**: [pnpm](https://pnpm.io/) for efficient monorepo management
- **Deployment**: Single-bundle deployment to Cloudflare Workers
- **Domain**: Custom domain with SSL (carsense.alinmiron.live)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/carsense-platform.git
   cd carsense-platform
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Set up environment variables:
   ```sh
   # API environment
   cp packages/api/.env.example packages/api/.env
   
   # Web app environment  
   cp packages/web/.env.example packages/web/.env
   ```
   Edit the `.env` files with your configuration details.

4. Set up the database:
   ```sh
   # Navigate to API package
   cd packages/api
   
   # Generate and run migrations
   bun run drizzle-kit generate
   bun run drizzle-kit migrate
   
   # Import DTC codes (optional)
   bun run src/scripts/import-dtc-codes.ts
   
   # Return to root
   cd ../..
   ```

5. Start the development servers:
   ```sh
   # Start API server
   pnpm run dev:api
   
   # In another terminal, start web app
   pnpm run dev:web
   ```

The API will be available at http://localhost:3000 and the web app at http://localhost:5173

## 📁 Project Structure

```
carsense-platform/
├── packages/
│   ├── api/                 # Backend API (Hono + Drizzle)
│   │   ├── src/
│   │   │   ├── routes/      # API route handlers
│   │   │   ├── db/          # Database schema and connection
│   │   │   ├── zod/         # Validation schemas
│   │   │   ├── emails/      # Email templates (React Email)
│   │   │   ├── middleware/  # Authentication & logging middleware
│   │   │   └── scripts/     # Utility scripts (DTC import, etc.)
│   │   ├── migrations/      # Database migrations
│   │   └── wrangler.jsonc   # Cloudflare Workers config
│   └── web/                 # Frontend web app (React + TypeScript)
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── features/    # Feature-based modules
│       │   │   ├── auth/    # Authentication
│       │   │   ├── dashboard/ # Analytics dashboard
│       │   │   ├── vehicles/  # Vehicle management
│       │   │   ├── diagnostics/ # Diagnostic analysis
│       │   │   ├── location/    # GPS tracking & maps
│       │   │   ├── maintenance/ # Service tracking
│       │   │   ├── charts/      # Data visualization
│       │   │   ├── sensors/     # Sensor monitoring
│       │   │   ├── export/      # Data export
│       │   │   ├── ownership/   # Vehicle transfers
│       │   │   └── notifications/ # Alert system
│       │   ├── routes/      # Application routes
│       │   └── lib/         # Utilities and configurations
│       └── public/          # Static assets
└── docs/                    # Documentation
```

## 📊 Database Schema

The system uses the following core tables:

- **`user`**: User accounts with OAuth and email authentication
- **`vehicles`**: Vehicle details (make, model, VIN, owner relationship)
- **`diagnostics`**: Diagnostic sessions with location and odometer data
- **`diagnosticDTC`**: Diagnostic trouble codes found during sessions
- **`dtcLibrary`**: Reference library of all DTC codes with descriptions
- **`locations`**: GPS location history with timestamps
- **`maintenanceLog`**: Service and maintenance records
- **`maintenanceLogServices`**: Service type associations
- **`serviceWorkshops`**: Service center information
- **`notifications`**: User notifications and alerts
- **`ownershipTransfers`**: Completed vehicle ownership transfers
- **`transferRequests`**: Pending transfer requests
- **`sensorReadings`**: Real-time sensor data
- **`sensorSnapshots`**: Sensor data snapshots for analysis

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/sign-up`: Create account with email/password
- `POST /api/auth/sign-in`: Authenticate user
- `GET /api/auth/github`: OAuth sign-in with GitHub
- `GET /api/auth/google`: OAuth sign-in with Google
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password with token
- `POST /api/auth/verify-email`: Verify email address
- `GET /api/session-status`: Get current session status

### Vehicles
- `GET /api/vehicles`: List user's vehicles (admin sees all)
- `POST /api/vehicles`: Register a new vehicle
- `GET /api/vehicles/:uuid`: Get vehicle details
- `PATCH /api/vehicles/:uuid`: Update vehicle information
- `DELETE /api/vehicles/:uuid`: Soft delete vehicle
- `GET /api/vehicles/:uuid/locations/recent`: Get recent vehicle locations

### Diagnostics
- `GET /api/diagnostics`: List diagnostic sessions
- `POST /api/diagnostics`: Create diagnostic session
- `GET /api/diagnostics/:uuid`: Get diagnostic details
- `POST /api/diagnostics/:uuid/dtcs`: Add DTC codes to session

### Dashboard & Analytics
- `GET /api/dashboard/overview`: Get comprehensive dashboard data
- `GET /api/dashboard/stats`: Get vehicle statistics and metrics

### Location Tracking
- `GET /api/locations`: Get location history
- `POST /api/locations`: Record new vehicle location
- `GET /api/locations/recent`: Get latest locations per vehicle
- `GET /api/locations/:uuid`: Get specific location details

### DTC Library
- `GET /api/dtc`: Search DTC codes with filters
- `GET /api/dtc/:code`: Get specific DTC code details
- `GET /api/dtc/library`: Get entire DTC database

### Maintenance
- `POST /api/maintenance`: Create maintenance entry
- `GET /api/maintenance/:vehicleUUID`: Get maintenance history
- `DELETE /api/maintenance/:entryUUID`: Delete maintenance entry

### Notifications
- `GET /api/notifications`: Get user notifications
- `PATCH /api/notifications/mark-read`: Mark notifications as read
- `DELETE /api/notifications/:uuid`: Delete notification
- `GET /api/notifications/unread-count`: Get unread count

### Ownership Management
- `POST /api/ownership-transfers`: Create transfer request
- `GET /api/ownership-transfers`: Get transfer requests (sent/received)
- `PATCH /api/ownership-transfers/:uuid/respond`: Accept/reject transfer
- `DELETE /api/ownership-transfers/:uuid/cancel`: Cancel transfer request
- `GET /api/ownership-transfers/:vehicleUUID/history`: Get transfer history

### File Upload
- `POST /api/upload/image`: Upload images to R2 storage
- `DELETE /api/upload/image`: Delete uploaded images

## 🌐 Web Application Features

### Main Navigation
- **Analytics** (`/app/:vehicleId/analytics`) - Dashboard with charts and metrics
- **Vehicle Status** (`/app/:vehicleId/vehicle-status`) - Current vehicle health
- **Diagnostics** (`/app/:vehicleId/diagnostics`) - DTC analysis and history
- **Location** (`/app/:vehicleId/location`) - GPS tracking and maps
- **Maintenance** (`/app/:vehicleId/maintenance`) - Service history and scheduling
- **Sensors** (`/app/:vehicleId/sensors`) - Real-time sensor monitoring
- **Charts** (`/app/:vehicleId/charts`) - Advanced data visualization
- **Tables** (`/app/:vehicleId/tables`) - Tabular data views
- **Export** (`/app/:vehicleId/export`) - Data export functionality
- **Ownership** (`/app/:vehicleId/ownership`) - Transfer management

### Global Features
- **Account** (`/app/account`) - Profile management and settings
- **Notifications** (`/app/notifications`) - Alert center
- **Register Vehicle** (`/app/register-vehicle`) - Add new vehicles
- **Help** (`/app/help`) - Documentation and support

### Authentication
- **Sign In** (`/sign-in`) - Email/password and OAuth login
- **Sign Up** (`/sign-up`) - Account registration
- **Forgot Password** (`/forgot-password`) - Password reset
- **Reset Password** (`/reset-password`) - Set new password

## 💾 Data Management Utilities

### DTC Code Management
1. **Convert DTC file** (`packages/api/src/scripts/convert-dtc.ts`):
   ```sh
   cd packages/api
   bun run src/scripts/convert-dtc.ts
   ```
   Converts binary DTC data to JSON format.

2. **Import DTC codes** (`packages/api/src/scripts/import-dtc-codes.ts`):
   ```sh
   cd packages/api
   bun run src/scripts/import-dtc-codes.ts
   ```
   Imports DTC codes into the database with severity classification.

## 🧪 Development

### Available Scripts

**Root level:**
- `pnpm run dev:api` - Start API server (port 3000)
- `pnpm run dev:web` - Start web app (port 5173)
- `pnpm run build:api` - Build API for production
- `pnpm run build:web` - Build web app for production
- `pnpm run lint:api` - Lint API code
- `pnpm run lint:web` - Lint web app code
- `pnpm run deploy` - Full deployment to Cloudflare Workers

**API specific** (in `packages/api/`):
- `bun run dev` - Development server with hot reload
- `bun run wrangler:dev` - Test with Cloudflare Workers locally
- `bun run wrangler:deploy` - Deploy to Cloudflare Workers

**Web specific** (in `packages/web/`):
- `bun run dev` - Vite development server
- `bun run build` - Production build
- `bun run preview` - Preview production build

### Development Workflow

1. **Adding API Endpoints**:
   - Create Zod schemas in `packages/api/src/zod/`
   - Add route handlers in `packages/api/src/routes/`
   - Register routes in `packages/api/src/app.ts`
   - Update OpenAPI documentation

2. **Adding Web Features**:
   - Create feature modules in `packages/web/src/features/`
   - Follow established patterns: `api/`, `components/`, `types/`, `utils/`
   - Use TanStack Form with Zod validation
   - Add routes in `packages/web/src/routes/`

3. **Database Changes**:
   - Update schema in `packages/api/src/db/schema/`
   - Generate migrations: `bunx drizzle-kit generate`
   - Apply migrations: `bunx drizzle-kit migrate`

4. **UI Components**:
   - Use shadcn/ui components from `packages/web/src/components/ui/`
   - Follow design system with CSS variables
   - Support both light and dark themes

## 🚀 Deployment

### Production Deployment
The platform uses a single-bundle deployment strategy:

```sh
# Build and deploy everything
pnpm run deploy
```

This process:
1. Builds the web app (`pnpm run build:web`)
2. Copies build artifacts to API directory (`pnpm run deploy:copy`)
3. Deploys to Cloudflare Workers (`pnpm run deploy:wrangler`)

### Environment Configuration
- **Production**: `packages/api/wrangler.jsonc`
- **Development**: `packages/api/wrangler.dev.jsonc`
- **Domain**: Custom domain with SSL termination
- **Assets**: Static files served from Cloudflare Workers
- **Database**: PostgreSQL on Neon with connection pooling

### Infrastructure
- **Frontend**: Served as static assets from Cloudflare Workers
- **Backend**: Hono API running on Cloudflare Workers
- **Database**: PostgreSQL with SSL on Neon
- **Storage**: Cloudflare R2 for image uploads
- **Email**: Resend for transactional emails
- **Monitoring**: Cloudflare observability with head sampling

## 🔧 Configuration

### Environment Variables

**API (`packages/api/.env`)**:
```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
RESEND_API_KEY=your-resend-key
R2_PUBLIC_URL=https://your-r2-domain.com
```

**Web (`packages/web/.env`)**:
```env
VITE_API_URL=http://localhost:3000
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, contact us at [support@carsense.alinmiron.live](mailto:support@carsense.alinmiron.live)
