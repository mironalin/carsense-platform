# CarSense Backend

A modern backend API for vehicle diagnostics, maintenance records, and OBD-II data analysis. Built with TypeScript, Hono, and Drizzle ORM.

## 🚗 Overview

CarSense Backend provides a robust API for tracking vehicle health, diagnostic trouble codes (DTCs), location data, and maintenance history. It serves as a centralized platform for connecting vehicles, service centers, and vehicle owners.

This backend is part of the larger CarSense ecosystem, which includes:

- 📱 **CarSense Android App**: An OBD2 diagnostics mobile application that connects to vehicle systems and sends data to the backend
- 🧠 **CarSense Predictive ML**: A machine learning neural network that analyzes vehicle data to predict maintenance needs, part failures, and performance issues
- 🖥️ **CarSense Web Interface**: A web application that provides access to vehicle data, diagnostics history, and predictive insights

### Key Features

- 🔧 **Diagnostics Management**: Store and retrieve vehicle diagnostic data
- 🚨 **DTC Library**: Comprehensive database of diagnostic trouble codes
- 📍 **Location Tracking**: Track vehicle locations with timestamp history
- 🚗 **Vehicle Management**: Store vehicle information and ownership details
- 🔐 **Authentication**: Secure API access with user authentication
- 📊 **Data Platform**: Serves as the central hub for the entire CarSense ecosystem

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/) for schema validation
- **API Docs**: OpenAPI specification with Hono
- **Logging**: Pino for structured logging

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- PostgreSQL database
- Node.js (v18 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/carsense-backend.git
   cd carsense-backend
   ```

2. Install dependencies:
   ```sh
   bun install
   ```

3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration details.

4. Run database migrations:
   ```sh
   bun run drizzle-kit generate
   bun run drizzle-kit migrate
   ```

5. Start the development server:
   ```sh
   bun run dev
   ```

The server will be available at http://localhost:3000

## 📊 Database Schema

The system uses the following core tables:

- `vehicles`: Vehicle details including make, model, VIN
- `diagnostics`: Diagnostic sessions for vehicles
- `diagnosticDTC`: Diagnostic trouble codes found during diagnostics
- `dtcLibrary`: Reference library of all DTC codes and descriptions
- `locations`: Vehicle location history
- `maintenanceLog`: Service and maintenance records

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new user account
- `POST /api/auth/login`: Authenticate and receive a token

### Vehicles
- `GET /api/vehicles`: List vehicles
- `POST /api/vehicles`: Register a new vehicle
- `GET /api/vehicles/:id`: Get vehicle details
- `PUT /api/vehicles/:id`: Update vehicle information
- `DELETE /api/vehicles/:id`: Remove a vehicle

### Diagnostics
- `GET /api/diagnostics`: List diagnostics
- `POST /api/diagnostics`: Create a new diagnostic session
- `POST /api/diagnostics/:id/dtcs`: Add DTC codes to a diagnostic session

### DTC Library
- `GET /api/dtc?code=P0001`: Look up a specific DTC code

### Locations
- `GET /api/locations`: Get vehicle locations
- `POST /api/locations`: Record a new vehicle location

## 💾 DTC Import Utilities

The project includes utilities for importing Diagnostic Trouble Codes:

1. **Convert DTC file** (`src/scripts/convert-dtc.ts`):
   ```sh
   npx tsx src/scripts/convert-dtc.ts
   ```
   Converts the original DTC.bin format to JSON for easier processing.

2. **Import DTC codes** (`src/scripts/import-dtc-codes.ts`):
   ```sh
   npx tsx src/scripts/import-dtc-codes.ts
   ```
   Imports the converted DTCs into the database with appropriate severity levels and categories.

## 🧪 Development

### Available Scripts

- `bun run dev`: Start the development server with hot reloading
- `bun run lint`: Run ESLint to check code quality
- `bun run lint:fix`: Fix linting issues automatically

### Adding a New Endpoint

1. Create or update the Zod schema in `src/zod/`
2. Add the route handler in `src/routes/`
3. Register the route in `src/app.ts`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
