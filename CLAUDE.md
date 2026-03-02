# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A bus ticket booking system (Futabus clone) with two separate sub-projects:
- **`DatVeXe-Client/`** — React + TypeScript frontend
- **`MDM-Project.Server/`** — Spring Boot backend

## Client Commands

All client commands are run from `DatVeXe-Client/`:

```bash
bun run dev       # Start dev server at http://localhost:5173
bun run build     # Type-check and build for production
bun run lint      # Run ESLint
npx biome check . # Run Biome linter/formatter check
npx biome format --write . # Auto-format with Biome
```

## Server Commands

Run from `MDM-Project.Server/`:

```bash
./mvnw spring-boot:run  # Start server at http://localhost:8080
./mvnw test             # Run tests
```

Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Database Setup (Docker required)

```bash
docker run -d -p 27017:27017 --name mongo -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mongo mongodb/mongodb-community-server:latest
docker run -d -p 6379:6379 --name redis redis:latest
```

## Client Architecture

### Routing — TanStack Router (file-based)

Routes live in `DatVeXe-Client/src/routes/`. The router plugin auto-generates `routeTree.gen.ts` from these files — **never edit `routeTree.gen.ts` manually**. Route files use `createFileRoute("/path")`.

Dynamic routes use `$` prefix: `booking.$id.tsx` → `/booking/:id`.

### Component Organization

`src/components/` is organized by feature domain:
- `ui/` — shadcn/ui primitives (Button, Card, Dialog, Input, etc.)
- `layout/` — shared layout (Header)
- `home/` — landing page (BusSearchForm, BusList)
- `booking/` — seat selection and booking form
- `auth/` — login/register forms
- `payment/` — payment form
- `lookup/` — ticket/invoice lookup
- `user/` — user profile/information

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. The `cn()` utility from `@/lib/utils` merges class names (clsx + tailwind-merge). UI components follow shadcn/ui "new-york" style with CSS variables for theming (`src/index.css`).

Path alias `@/` maps to `src/`.

### Auth State

`AuthProvider` in `src/contexts/auth-context.tsx` wraps the app and provides `useAuth()` hook. Auth state (`isLoggedIn`) is persisted to `localStorage`. Note: this is currently a placeholder — no actual JWT/token handling is implemented yet.

## Server Architecture

Package root: `org.example.mdmprojectserver`

The server is split into two sub-packages by database concern:

**`mongodb/`** — Core domain logic backed by MongoDB:
- `model/` — Domain entities: `Bus`, `Customer`, `Ticket`, `Invoice`, `Seat`
- `repository/` — Spring Data MongoDB repositories
- `controller/` — REST controllers: `AuthController`, `BusController`, `CustomerController`, `TicketController`, `InvoiceController`
- `dto/` — Request/response DTOs
- `security/` — JWT-based Spring Security (stateless, `JWTAuthenticationFilter`, `JWTGenerator`)
- `enums/` — `BusType`, `Status`, `Gender`, `SortType`, `TimeType`

**`redis/`** — Temporary booking seat reservation backed by Redis:
- `BookingService` — Stores pending ticket bookings in Redis with a 30-second TTL. On `confirmBooking`, moves data to MongoDB and creates an Invoice.
- `BookingController` — Endpoints for book/get/confirm ticket
- `KeyExpirationListener` — Handles Redis key expiry events to release seats

**Key flow**: When a user selects seats, a `Ticket` is stored in Redis (`busId:customerId` key, 30s TTL) and seat status is updated on the `Bus` document in MongoDB. On payment confirmation, the ticket is persisted to MongoDB and an `Invoice` is generated.

## Code Style

The client uses **Biome** as the primary formatter/linter (tabs for indentation, double quotes for JS/TS strings). ESLint is also present but Biome is preferred. `noExplicitAny` is enforced — avoid `any` types.
