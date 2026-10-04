# Finora Backend API

Finora is a smart personal finance management platform tailored for Students, Employees, and Business Owners. The backend is built with Java 21, Spring Boot 3, and PostgreSQL.

## Features
- **Stateless Authentication**: JWT-based login, strict Role-Based Access Control (RBAC).
- **Personal Finance**: Income, Expenses, Recurring Expenses, Dashboard metrics.
- **Borrow / Lend System**: Track loans lent/borrowed, automatic due-date expiration and scheduling, partial repayment logic.
- **Business Management**: Complete abstraction for `BUSINESS_OWNER` users to track sales, expenses, staff, and rolling monthly salary management.
- **Storage & Reports**: Secure uploads and highly optimized database-aggregation for financial reports.

## Prerequisites
- Docker & Docker Compose
- Or: Java 21 & Local PostgreSQL instance.

## Running the Application (Docker)
The easiest way to run Finora is via Docker.

1. Ensure Docker daemon is running.
2. In the project root, build and start the containers:
   ```bash
   docker-compose up --build -d
   ```
3. The API will be available at `http://localhost:8080`.
4. The Swagger/OpenAPI documentation is available at `http://localhost:8080/swagger-ui/index.html`.

## Environment Variables
If running manually, populate the following environment variables (or rely on `application.yml` defaults):
- `DB_URL` (e.g., `jdbc:postgresql://localhost:5432/finora`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` (Ensure it is at least 256-bit / 32 bytes for HS256)
- `JWT_EXPIRATION` (in milliseconds)

## Database Migrations
We use Flyway for database schema versioning.
On application startup, Flyway automatically executes `V1__init.sql` if the database is completely empty.

## Access Rules
- Endpoints under `/api/business/**`, `/api/staff/**`, and `/api/salary/**` require the logged-in user to have the `BUSINESS_OWNER` role.
- Other endpoints are available to `STUDENT`, `EMPLOYEE`, and `BUSINESS_OWNER`.
