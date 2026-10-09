# API conventions

## REST

- Base path: `/api/v1`.
- Resources in plural `kebab-case`: `/professionals`, `/appointments`, `/availability-rules`.
- Nested routes only for strong ownership: `/appointments/:id/images`, `/conversations/:id/messages`.
- The current user is `/me` (`GET /me`, `PATCH /me`, `GET /me/appointments`).
- State changes that are not plain updates are actions: `POST /appointments/:id/accept`, `/reject`, `/cancel`, `/complete`.
- JSON bodies in `camelCase`.

| Method | Use | Success code |
|---|---|---|
| GET | Read | 200 |
| POST | Create / action | 201 (create), 200 (action) |
| PATCH | Partial update | 200 |
| DELETE | Delete | 204 |

## Validation

- Every body, query and param is validated with a Zod schema from `@sm/shared`, through `nestjs-zod` (`createZodDto` + global `ZodValidationPipe`).
- The same schema validates the form in the web app.
- Unknown properties are stripped.

## Errors

Global exception filter; every error has the same shape:

```json
{
  "statusCode": 422,
  "error": "UNPROCESSABLE_ENTITY",
  "code": "APPOINTMENT_INVALID_TRANSITION",
  "message": "Cannot accept an appointment that is cancelled.",
  "details": []
}
```

- `code` is a stable machine-readable string, listed in `@sm/shared` (`ErrorCode` enum) so the web can map it to Spanish UI messages.
- `details` holds Zod issues for validation errors (`400`).
- Codes: `400` validation, `401` not authenticated, `403` not allowed, `404` not found, `409` conflict (duplicates), `422` business rule violated.

## Pagination

Cursor-based for every list (`NFR-05`):

```
GET /professionals?category=plumber&limit=20&cursor=<opaque>
```

```json
{ "items": [], "nextCursor": "eyJpZCI6..." }
```

`nextCursor: null` means there are no more pages. The cursor is opaque (base64 of the sort key + `id`).

## Authentication and authorization

- Access token (short-lived) and refresh token in **httpOnly, Secure, SameSite** cookies (`NFR-03`).
- `JwtAuthGuard` is global; public routes use a `@Public()` decorator.
- `@CurrentUser()` decorator injects the authenticated user.
- Resource-level permissions in dedicated guards (e.g. `AppointmentParticipantGuard`, `AppointmentProfessionalGuard`). Being a client or a professional is not a global role: it depends on the relation to the resource.

## WebSockets

- Socket.IO gateway under namespace `/chat` (and `/notifications`).
- Authenticated with the same cookie during the handshake.
- Room per conversation: `conversation:<id>`. Events in `snake_case`: `message_sent`, `message_read`.

## Documentation

- Swagger at `/api/docs` (disabled in production or protected).
- Every endpoint has a summary and documented responses.

## Configuration

- Environment variables validated with a Zod schema at startup; the app fails fast if one is missing (`NFR-09`).
- Documented in `apps/api/.env.example`.
