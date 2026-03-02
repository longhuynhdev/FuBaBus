# TanStack Router Tutorial

A practical guide to routing in this project.

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Creating Routes](#2-creating-routes)
3. [Navigation](#3-navigation)
4. [Dynamic Routes](#4-dynamic-routes)
5. [Layouts](#5-layouts)
6. [Search Parameters](#6-search-parameters)
7. [Data Loading](#7-data-loading)

---

## 1. Project Structure

TanStack Router uses **file-based routing**. Each file in `src/routes/` becomes a route:

```
src/routes/
├── __root.tsx          # Root layout (wraps all pages)
├── index.tsx           # / (home page)
├── login.tsx           # /login
├── register.tsx        # /register
├── booking.$id.tsx     # /booking/:id (dynamic route)
├── payment.tsx         # /payment
└── tra-cuu-ve.tsx      # /tra-cuu-ve
```

**File naming rules:**
- `index.tsx` → `/` (root path)
- `about.tsx` → `/about`
- `user.profile.tsx` → `/user/profile` (dots become slashes)
- `booking.$id.tsx` → `/booking/:id` ($ prefix = dynamic parameter)

---

## 2. Creating Routes

### Basic Route

Create a file `src/routes/about.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

// Define the route
export const Route = createFileRoute("/about")({
  component: AboutPage,
});

// The component
function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page.</p>
    </div>
  );
}
```

**Key points:**
- `createFileRoute("/about")` must match the file path
- Export `Route` (required name)
- Component can be inline or imported

### After Creating a Route

Run the dev server - TanStack Router auto-generates the route tree:

```bash
bun run dev
```

Check `src/routeTree.gen.ts` - it's auto-generated, don't edit it!

---

## 3. Navigation

### Using `<Link>` Component

```tsx
import { Link } from "@tanstack/react-router";

function Navigation() {
  return (
    <nav>
      {/* Basic link */}
      <Link to="/">Home</Link>

      {/* Link with active styling */}
      <Link
        to="/about"
        activeProps={{ className: "text-orange-600 font-bold" }}
      >
        About
      </Link>

      {/* Link to dynamic route */}
      <Link to="/booking/$id" params={{ id: "123" }}>
        Book Bus #123
      </Link>
    </nav>
  );
}
```

### Using `useNavigate` Hook

```tsx
import { useNavigate } from "@tanstack/react-router";

function BookingButton() {
  const navigate = useNavigate();

  const handleBook = () => {
    // Navigate programmatically
    navigate({ to: "/booking/$id", params: { id: "456" } });
  };

  return <button onClick={handleBook}>Book Now</button>;
}
```

### Navigate with Search Params

```tsx
const navigate = useNavigate();

// Navigate with query string: /search?q=hanoi&date=2026-02-10
navigate({
  to: "/search",
  search: { q: "hanoi", date: "2026-02-10" },
});
```

---

## 4. Dynamic Routes

### Creating Dynamic Routes

File: `src/routes/booking.$id.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/$id")({
  component: BookingPage,
});

function BookingPage() {
  // Get the dynamic parameter
  const { id } = Route.useParams();

  return (
    <div>
      <h1>Booking #{id}</h1>
      {/* Use id to fetch data */}
    </div>
  );
}
```

### Multiple Dynamic Segments

File: `src/routes/user.$userId.orders.$orderId.tsx`

```tsx
// Route: /user/:userId/orders/:orderId

export const Route = createFileRoute("/user/$userId/orders/$orderId")({
  component: OrderPage,
});

function OrderPage() {
  const { userId, orderId } = Route.useParams();

  return (
    <div>
      <p>User: {userId}</p>
      <p>Order: {orderId}</p>
    </div>
  );
}
```

---

## 5. Layouts

### Root Layout

File: `src/routes/__root.tsx`

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div>
      {/* Global header */}
      <header>My App</header>

      {/* Child routes render here */}
      <Outlet />

      {/* Global footer */}
      <footer>© 2026</footer>
    </div>
  );
}
```

### Nested Layouts

Create a layout for `/user/*` routes:

File: `src/routes/user.tsx` (layout)

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/user")({
  component: UserLayout,
});

function UserLayout() {
  return (
    <div className="flex">
      {/* Sidebar for all /user/* pages */}
      <aside className="w-64">
        <Link to="/user/profile">Profile</Link>
        <Link to="/user/settings">Settings</Link>
      </aside>

      {/* Child routes */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
```

File: `src/routes/user.profile.tsx`

```tsx
export const Route = createFileRoute("/user/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return <h1>Profile</h1>; // Renders inside UserLayout
}
```

---

## 6. Search Parameters

### Define Search Params Schema

```tsx
import { createFileRoute } from "@tanstack/react-router";

// Define the search params type
type SearchParams = {
  q?: string;
  page?: number;
  sort?: "asc" | "desc";
};

export const Route = createFileRoute("/search")({
  // Validate and parse search params
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: (search.q as string) || "",
      page: Number(search.page) || 1,
      sort: (search.sort as "asc" | "desc") || "asc",
    };
  },
  component: SearchPage,
});

function SearchPage() {
  // Type-safe search params
  const { q, page, sort } = Route.useSearch();

  return (
    <div>
      <p>Query: {q}</p>
      <p>Page: {page}</p>
      <p>Sort: {sort}</p>
    </div>
  );
}
```

### Navigate with Search Params

```tsx
import { Link, useNavigate } from "@tanstack/react-router";

function SearchForm() {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate({
      to: "/search",
      search: { q: query, page: 1 },
    });
  };

  return (
    <>
      {/* Or use Link */}
      <Link to="/search" search={{ q: "hanoi", page: 1, sort: "desc" }}>
        Search Hanoi
      </Link>
    </>
  );
}
```

---

## 7. Data Loading

### Load Data Before Rendering

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/$id")({
  // Load data before component renders
  loader: async ({ params }) => {
    const response = await fetch(`/api/buses/${params.id}`);
    const bus = await response.json();
    return { bus };
  },
  component: BookingPage,
});

function BookingPage() {
  // Access loaded data (type-safe)
  const { bus } = Route.useLoaderData();

  return (
    <div>
      <h1>{bus.name}</h1>
      <p>Price: {bus.fare}</p>
    </div>
  );
}
```

### Loading State

```tsx
export const Route = createFileRoute("/booking/$id")({
  loader: async ({ params }) => {
    const bus = await fetchBus(params.id);
    return { bus };
  },
  // Show while loading
  pendingComponent: () => <div>Loading...</div>,
  // Show on error
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  component: BookingPage,
});
```

---

## Quick Reference

| Task | Code |
|------|------|
| Create route | `export const Route = createFileRoute("/path")({ component })` |
| Get URL params | `const { id } = Route.useParams()` |
| Get search params | `const { q } = Route.useSearch()` |
| Navigate | `navigate({ to: "/path" })` |
| Navigate with params | `navigate({ to: "/booking/$id", params: { id: "123" } })` |
| Navigate with search | `navigate({ to: "/search", search: { q: "test" } })` |
| Link component | `<Link to="/path">Click</Link>` |
| Active link styling | `<Link activeProps={{ className: "active" }}>` |
| Render children | `<Outlet />` |
| Load data | `loader: async ({ params }) => { ... }` |
| Access loader data | `Route.useLoaderData()` |

---

## Project Examples

Check these files in the project:

- **Basic route**: `src/routes/login.tsx`
- **Dynamic route**: `src/routes/booking.$id.tsx`
- **Root layout**: `src/routes/__root.tsx`
- **Navigation**: `src/components/layout/header.tsx`

---

## Resources

- [TanStack Router Docs](https://tanstack.com/router/latest/docs/overview)
- [File-Based Routing](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
- [Type Safety](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety)
