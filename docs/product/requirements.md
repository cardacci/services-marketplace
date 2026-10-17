# Requirements

Every requirement has a stable ID. Specs, plans, tests and PRs reference these IDs. Do not renumber; mark removed items as `~~Removed~~` instead.

Priority: **P1** = MVP, **P2** = after MVP.

## Functional requirements

### Authentication and onboarding (`AUTH`)

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | A user signs in with Google. | P1 |
| FR-AUTH-02 | On first sign-in, the user is asked whether they offer services ("¿Sos profesional?") and completes onboarding accordingly. | P1 |
| FR-AUTH-03 | Client onboarding collects first name, last name, address, phone and photo (photo prefilled from Google). | P1 |
| FR-AUTH-04 | Professional onboarding collects the client data plus base address (where they work from, prefilled with the onboarding address), categories (one or more), weekly availability, license number (required for categories that need one) and optional bio. | P1 |
| FR-AUTH-05 | A user can sign out from Settings. | P1 |
| FR-AUTH-06 | A client can later become a professional by completing the professional profile. | P2 |

### Search and discovery (`SRCH`)

| ID | Requirement | Priority |
|---|---|---|
| FR-SRCH-01 | Home shows a list of professionals for the client. | P1 |
| FR-SRCH-02 | Filter by category. | P1 |
| FR-SRCH-03 | Filter / sort by rating. | P1 |
| FR-SRCH-04 | Filter / sort by distance to one of the client's addresses. Distance is measured to the professional's base address. The client picks the maximum distance from 1, 5, 10, 25 or 50 km; the default is 10 km. | P1 |
| FR-SRCH-05 | Search by professional first or last name. The name filter applies only when the trimmed text has at least 2 characters; below that, results use the other filters only. The backend enforces the same minimum. The request is sent 300 ms after the user stops typing (debounce). | P1 |
| FR-SRCH-06 | Results are paginated (infinite scroll). | P1 |

### Professional profile (`PROF`)

| ID | Requirement | Priority |
|---|---|---|
| FR-PROF-01 | A professional profile shows name, photo, bio, categories, rating, review count, recent reviews and distance to the client's selected address (never the professional's address, see `BR-17`). | P1 |
| FR-PROF-02 | Professionals with a verified license show a visual check badge. In Phase 1 the license number is only stored, not verified, so no badge is shown. | P2 |
| FR-PROF-03 | A professional edits categories, bio, base address and license number. | P1 |
| FR-PROF-04 | A professional manages weekly availability per weekday (see `BR-05`, `BR-06`). | P1 |

### Appointments (`APPT`)

| ID | Requirement | Priority |
|---|---|---|
| FR-APPT-01 | A client requests an appointment from a professional's profile with date, time, category, address, description and up to 3 images. The time must fall within the professional's availability (see `BR-13`). | P1 |
| FR-APPT-02 | The professional sees pending requests and accepts or rejects them. Before accepting, the professional can change the appointment duration (see `BR-14`). | P1 |
| FR-APPT-03 | Either party can cancel a pending or accepted appointment; the app records who cancelled. | P1 |
| FR-APPT-04 | An accepted appointment is marked as completed automatically when its end date and time is reached (see `BR-15`). | P1 |
| FR-APPT-05 | The professional's home shows pending jobs, an agenda of accepted appointments and recently completed jobs. | P1 |
| FR-APPT-06 | The client sees their appointments grouped by status. | P1 |

### Chat (`CHAT`)

| ID | Requirement | Priority |
|---|---|---|
| FR-CHAT-01 | An accepted appointment opens a conversation between client and professional. | P1 |
| FR-CHAT-02 | Messages are delivered in real time and show date and time. | P1 |
| FR-CHAT-03 | Unread messages are counted and marked as read when seen. | P1 |

### Reviews (`REV`)

| ID | Requirement | Priority |
|---|---|---|
| FR-REV-01 | After an appointment is completed, the client can review the professional and the professional can review the client, within the review window (see `BR-16`). | P1 |
| FR-REV-02 | A review has 1–5 stars, an optional comment and up to 3 images. | P1 |
| FR-REV-03 | The professional's rating average and count update when a review is created. | P1 |

### Notifications (`NOTIF`)

| ID | Requirement | Priority |
|---|---|---|
| FR-NOTIF-01 | In-app notifications for: appointment requested, accepted, rejected, cancelled, completed; review available; new message. | P1 |
| FR-NOTIF-02 | A badge shows the unread notification count; notifications can be marked as read. | P1 |
| FR-NOTIF-03 | Email and/or push notifications. | P2 |

### Favorites (`FAV`)

| ID | Requirement | Priority |
|---|---|---|
| FR-FAV-01 | A client adds or removes a professional from favorites. | P1 |
| FR-FAV-02 | A client sees their favorites list. | P1 |

### Settings (`SET`)

| ID | Requirement | Priority |
|---|---|---|
| FR-SET-01 | A user edits personal data (name, phone, photo). | P1 |
| FR-SET-02 | A user manages their addresses (add, edit, delete). | P1 |
| FR-SET-03 | Settings is reachable from the avatar on Home and on the professional home. | P1 |

## Business rules

| ID | Rule |
|---|---|
| BR-01 | A user can be both client and professional. Being a professional means having a professional profile. |
| BR-02 | A user cannot request an appointment from themselves. |
| BR-03 | Appointment status transitions: `pending → accepted / rejected / cancelled`; `accepted → cancelled / completed`. `rejected`, `cancelled` and `completed` are final. |
| BR-04 | Only the professional of an appointment can accept or reject it. |
| BR-05 | Default availability when a professional profile is created: Monday to Friday, 08:00–16:00. |
| BR-06 | Availability is defined per weekday and can contain several time ranges per day; ranges on the same day cannot overlap and `start < end`. |
| BR-07 | An appointment and a review each accept at most 3 images. |
| BR-08 | A review can only be created for a `completed` appointment, by one of its two participants, once per participant. The reviewee is the other participant (computed by the backend). |
| BR-09 | Chat is only available for appointments that are or were `accepted`. |
| BR-10 | Categories flagged `requires_license` (e.g. gas fitter) require a license number for a professional to offer them. |
| BR-11 | Appointments and reviews are never deleted; deleting data must not break history (soft delete where needed). |
| BR-12 | No in-app payments in Phase 1. |
| BR-13 | A client cannot request an appointment outside the professional's availability: the whole slot (start time plus default duration) must fit inside one availability range. |
| BR-14 | Appointment duration defaults to 60 minutes. The professional can change it while the appointment is `pending`; it is fixed once accepted. End time = start time + duration. |
| BR-15 | An `accepted` appointment moves to `completed` automatically when its end time is reached. Nobody marks it manually. |
| BR-16 | A review can be created up to 30 days after the appointment is completed. After that, the review is no longer available. |
| BR-17 | A professional's base address is private. Other users only see the distance to it (e.g. "3.2 km"); the API never returns the address or its coordinates to them. |

## Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Responsive web app, mobile first. |
| NFR-02 | All API input validated with shared Zod schemas; uniform error format. |
| NFR-03 | Authentication with httpOnly cookies; no tokens in localStorage. |
| NFR-04 | Proximity search must use indexed geospatial queries (PostGIS + GIST). |
| NFR-05 | List endpoints use cursor-based pagination. |
| NFR-06 | Runs on free hosting tiers (cold starts are acceptable). |
| NFR-07 | Every PR runs lint, typecheck, tests and build; `main` deploys automatically. |
| NFR-08 | Business logic in services is covered by unit tests; every endpoint has at least one e2e test. |
| NFR-09 | Secrets never committed; configuration validated at startup. |

## Open questions

None for now.
