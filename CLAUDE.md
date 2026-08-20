# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A bus ticket booking system (Futabus clone) with two separate sub-projects:
- **`Client/`** — React + TypeScript frontend
- **`Server/`** — Spring Boot backend

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

### Profiles

- **`dev`** (default, `application-dev.properties`) — connects to Mongo/Redis on `localhost` via `./mvnw spring-boot:run`. This is what the commands above use.
- **`prod`** (`application-prod.properties`) — hostnames default to the Docker Compose service names (`redis`, etc.), so it's meant to run via `docker compose up --build` in `Server/`, not directly on the host. `spring.data.redis.host`/`port`/`password` can be overridden with `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD` env vars if you need to run `prod` outside compose (e.g. `REDIS_HOST=localhost ./mvnw spring-boot:run -Dspring-boot.run.profiles=prod`).

### Database Setup (Docker required)

For the `dev` profile:

```bash
docker run -d -p 27017:27017 --name mongo -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mongo mongodb/mongodb-community-server:latest
docker run -d -p 6379:6379 --name redis redis:latest redis-server --notify-keyspace-events Ex
```

`--notify-keyspace-events Ex` is required for `KeyExpirationListener` to receive seat-release events on booking TTL expiry.

## Client Architecture

### Routing — TanStack Router (file-based)

Routes live in `Client/src/routes/`. The router plugin auto-generates `routeTree.gen.ts` from these files — **never edit `routeTree.gen.ts` manually**. Route files use `createFileRoute("/path")`.

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

## Commit Suggestions

After completing a task that represents a logical stopping point, suggest a concise commit message of one to two lines following the Conventional Commits format (e.g., `feat: add seat selection UI`, `fix: correct booking TTL expiry`). Do not commit automatically — just provide the message for the user to use.

## UI & Responsiveness

After any UI change, verify the component looks correct at mobile (≤ 640px), tablet (641–1024px), and desktop (> 1024px) widths.

Responsive conventions used in this project:
- **Mobile-first**: base classes target mobile, `sm:` (640px) and `lg:` (1024px) prefixes handle larger screens.
- **Layout**: prefer `flex flex-wrap` or `grid` over fixed-width single-row `flex` so items reflow naturally.
- **Fixed pixel padding** (`px-[100px]` etc.) must always be paired with a mobile override (`px-4 sm:px-[100px]`).
- **Header logo**: uses a 3-column `grid grid-cols-3` so the logo stays truly centered at all screen sizes.
