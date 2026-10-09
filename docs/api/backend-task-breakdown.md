# Backend Task Breakdown & Response Standard — Mojiji AnimeList

## 1. Document Information

| Field | Value |
|---|---|
| Project | Mojiji AnimeList |
| Ticket | MJ-026 |
| Owner | Syafii — Backend |
| Related ticket | MJ-025 — API Contract MVP |
| Document status | Working standard for implementation and QA |
| Last updated | 2026-10-10 |

## 2. Purpose

This document breaks down MVP backend work and defines a consistent response convention for Backend, Frontend, and QA. Keep it aligned with `docs/api/api-contract-mvp.md`. Any later change to the public API contract should be reviewed by affected roles and reflected in both documents.

This document describes the agreed working convention and planned tasks. It does not claim that every endpoint has already been implemented or tested.

## 3. Services and Responsibilities

| Service | Default local port | Responsibility |
|---|---:|---|
| API Gateway | 3000 | Client entry point and routing to the appropriate service |
| User Service | 3001 | Registration, login/logout, and current-user profile |
| Catalog Service | 3002 | Anime/manga search and detail retrieval from the external catalog provider |
| Tracker Service | 3003 | User's tracked entries and progress/status changes |

Ports describe the local setup; they do not imply every endpoint is implemented.

## 4. MVP Endpoint Breakdown

The endpoints below follow the project's API Overview and API Contract MVP.

| Area | Method and endpoint | Responsibility |
|---|---|---|
| Auth | `POST /api/auth/register` | Create an account and validate registration input |
| Auth | `POST /api/auth/login` | Authenticate a user using the agreed session/token approach |
| Auth | `POST /api/auth/logout` | End the current session/token where applicable |
| User | `GET /api/users/me` | Return the authenticated user's profile |
| Catalog | `GET /api/catalog/search?type=anime\|manga&q=...` | Search the anime/manga catalog |
| Catalog | `GET /api/catalog/:type/:malId` | Return details for one anime or manga item |
| Tracker | `GET /api/tracker?status=...` | List the authenticated user's tracked entries, optionally filtered by status |
| Tracker | `POST /api/tracker` | Add an item to the authenticated user's tracker |
| Tracker | `PATCH /api/tracker/:id/status` | Change an entry's tracking status |
| Tracker | `POST /api/tracker/:id/increment` | Increment progress according to the agreed tracker rules |
| Tracker | `DELETE /api/tracker/:id` | Remove an entry owned by the authenticated user |

Comments, notifications, and reminders are outside this MVP list unless the product owner explicitly adds them to scope.

## 5. Eight Required Fields for GitHub Projects Tickets

Every backend ticket should include:

1. **Ticket ID** — unique identifier, such as `MJ-026`.
2. **Title** — concise, action-oriented name.
3. **Description / Scope** — what is included and excluded.
4. **Acceptance Criteria (AC)** — observable conditions for completion.
5. **Owner** — person responsible for delivery.
6. **Priority** — relative importance agreed by the team.
7. **Status** — workflow state, such as Todo, In Progress, In Review, or Done.
8. **Dependencies** — prerequisite tickets or decisions; use `None` if there are none.

Estimate or due date may be added if the team's board requires it, but they are not counted among these eight required fields.

## 6. Proposed Backend Task Breakdown

Create or update these as actual tickets in GitHub Projects. The task groupings below are not proof that tickets already exist; assign the ticket ID, owner, priority, status, and dependencies on the board.

### A. API Gateway
**Scope**
- Provide the HTTP entry point for client requests.
- Route supported `/api/auth`, `/api/users`, `/api/catalog`, and `/api/tracker` requests to the correct service.
- Handle gateway-level errors without exposing stack traces or secrets.

**Acceptance criteria**
- Starts on its configured local port.
- `GET /health` returns HTTP `200` when healthy.
- Requests are routed according to the agreed route configuration.
- Gateway-generated errors follow the shared error envelope.

**Dependencies:** service skeletons and agreed route configuration.

### B. User Service and Authentication
**Scope**
- Implement registration, login, logout, and `GET /api/users/me`.
- Validate input and return safe errors.
- Hash passwords; never store or return plaintext passwords.
- Protect user-specific endpoints.

**Acceptance criteria**
- Valid requests follow the API contract.
- Invalid input returns the shared error envelope and an appropriate status.
- Unauthenticated requests to protected endpoints return `401`.
- Passwords and sensitive authentication material are never returned.
- `GET /api/users/me` returns only the authenticated user's profile.

**Dependencies:** agreed authentication/session approach and database schema.

### C. Catalog Service
**Scope**
- Implement search and detail endpoints for anime and manga.
- Normalize external-provider data into the project's public response shape.
- Handle provider timeouts, rate limits, outages, and malformed responses.

**Acceptance criteria**
- Search validates `type` and required query input.
- Detail requests validate type and catalog identifier.
- Successful results use the shared success envelope.
- Invalid input returns `400`; a confirmed missing catalog item returns `404`.
- Provider failures are translated into the public error format.
- Raw provider payloads, credentials, and stack traces are not leaked.

**Dependencies:** catalog provider choice and API contract.

### D. Tracker Service
**Scope**
- Implement list, create, status update, progress increment, and delete operations.
- Require authentication for tracker data.
- Enforce ownership checks and validate status/progress rules.

**Acceptance criteria**
- Users can list only their own entries.
- Create/update/delete validate input and ownership.
- Missing entries return `404`.
- Unauthenticated requests return `401`; authenticated but forbidden operations return `403` where applicable.
- Successful operations follow the shared success convention, except `204` responses which have no body.

**Dependencies:** authentication contract, tracker schema, and agreed status/progress rules.

### E. Shared API Response Convention
**Scope**
- Apply the response convention below to MVP endpoints.
- Align `docs/api/api-contract-mvp.md` with this document.
- Add/update tests for representative success and error responses.

**Acceptance criteria**
- Contract documents success, error, and no-content responses.
- Implemented endpoints use documented status codes and envelopes.
- Error codes are stable for Frontend handling and QA assertions.
- Frontend and QA can refer to the same committed contract.

**Dependencies:** this document and the API Contract MVP review.

## 7. Shared API Response Convention

### 7.1 Success with a body

Use this shape for successful responses that include a body:

```json
{
  "success": true,
  "data": {
    "id": "example-id"
  }
}
```

Rules:
- `success` must be `true`.
- `data` contains the endpoint's payload.
- The structure of `data` must be documented per endpoint.
- Add `meta` only when an endpoint actually defines metadata such as pagination.

For a list endpoint, `data` is an array:

```json
{
  "success": true,
  "data": [
    {
      "id": "example-id",
      "title": "Example title"
    }
  ]
}
```

If pagination is implemented, document the exact `meta` fields in the endpoint contract before returning them.

### 7.2 No-content response

Use HTTP `204 No Content` only when the operation succeeds and the API contract explicitly specifies no response body. A `204` response must not contain a JSON envelope or body.

For example, a successful delete may return `204` if the API contract specifies it. Otherwise, use a documented response such as HTTP `200`.

### 7.3 Error response

For errors with a body, use:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

Rules:
- `success` must be `false`.
- `error.code` is a stable machine-readable code.
- `error.message` is a concise, safe message.
- `error.details` is an array of safe field-level or additional details; use `[]` when none apply.
- Never return stack traces, secrets, password values, tokens, or private provider details.

Example with validation details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "A valid email address is required"
      }
    ]
  }
}
```

### 7.4 HTTP status mapping

Use the status that best describes the result. Document endpoint-specific behavior in `docs/api/api-contract-mvp.md`.

| HTTP status | Meaning | Example code/use |
|---:|---|---|
| `200 OK` | Success with a response body | Successful read or update |
| `201 Created` | A resource was created | Registration or tracker creation |
| `204 No Content` | Success with no body | Delete, only if specified by the contract |
| `400 Bad Request` | Invalid client input | `VALIDATION_ERROR` |
| `401 Unauthorized` | Authentication missing or invalid | `UNAUTHENTICATED` |
| `403 Forbidden` | Authenticated user is not allowed to perform the action | `FORBIDDEN` |
| `404 Not Found` | Resource or route does not exist | `NOT_FOUND` |
| `409 Conflict` | Request conflicts with existing state | `CONFLICT` |
| `429 Too Many Requests` | This API is rate-limiting the client | `RATE_LIMITED` |
| `502 Bad Gateway` | Upstream provider/service returned an unusable response | `UPSTREAM_ERROR` |
| `503 Service Unavailable` | Service is temporarily unavailable | `SERVICE_UNAVAILABLE` |
| `504 Gateway Timeout` | An upstream request timed out | `UPSTREAM_TIMEOUT` |
| `500 Internal Server Error` | Unexpected internal error | `INTERNAL_ERROR` |

Do not blindly expose the upstream provider's status or raw response. Translate provider failures into the public API status and error code defined for this project.

## 8. Validation and Security Rules

- Validate query parameters, path parameters, and request bodies.
- Use `400` with `VALIDATION_ERROR` for invalid client input.
- Use `401` for missing/invalid authentication.
- Use `403` for authenticated users who are not authorized to perform an operation.
- Check ownership for all tracker operations that access user-specific entries.
- Hash passwords and never log or return passwords, tokens, or secrets.
- Return safe client-facing messages; keep detailed diagnostics in logs with sensitive data removed.
- Catalog Service must handle provider timeouts, rate limits, and outages.
- Public API responses must not expose the external provider's raw payload.

## 9. Responsibilities and Handoff

**Backend**
- Maintain the API contract and implement the shared response convention.
- Keep endpoint behavior and status codes aligned with documentation.
- Test success, validation, authentication, authorization, missing resources, and upstream failures where relevant.
- Update the contract after an approved API change.

**Frontend**
- Read the contract and consume successful payloads from `data`.
- Handle errors using `error.code` and a safe display message.
- Report missing fields or mismatches instead of depending on undocumented behavior.

**QA**
- Derive tests from endpoint acceptance criteria and the API contract.
- Verify status codes, envelopes, validation, authentication, ownership, and provider failures.
- Report deviations against the documented contract.

## 10. Definition of Done — MJ-026

- [ ] This document is committed as `docs/api/backend-task-breakdown.md`.
- [ ] `docs/api/api-contract-mvp.md` is checked and aligned with the response convention.
- [ ] Backend task tickets exist in GitHub Projects and contain the eight required fields.
- [ ] Each ticket has observable acceptance criteria and dependencies.
- [ ] The response convention is recorded in the project documentation and shared with Frontend and QA.
- [ ] Review feedback is resolved and reflected in the documents.
- [ ] The Pull Request is reviewed and merged according to repository workflow.

Do not mark an item complete without evidence. A written proposal alone does not prove tickets were created, tests passed, or implementation was completed.

## 11. Next Git Steps

The file was created locally on branch `docs/MJ-026-backend-task-breakdown`. After replacing the draft with this updated version, review the diff, stage, commit, push, and open a Pull Request targeting `develop`.

Suggested commit message:

```text
docs(api): break down backend tasks [MJ-026]
```

Before opening the PR, compare `docs/api/api-contract-mvp.md` against this standard and update any conflicting examples.
