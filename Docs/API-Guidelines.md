# API Endpoint Naming 
## Convention 
REST API endpoints should follow these rules:
1. **Use nouns, not verbs** — The HTTP method (GET, POST, PUT, DELETE) conveys the action; the URL identifies the resource.
2. **Use plural nouns for collections** — `/buses`, `/tickets`, `/bookings`.
3. **Use lowercase letters only** — No camelCase or PascalCase in URL paths.
4. **Use hyphens (`-`) for multi-word segments** — Not camelCase or underscores.
5. **No trailing slashes** — `/api/buses` not `/api/buses/`.
6. **Hierarchical structure for sub-resources** — `/api/bookings/{id}/confirmation`.
