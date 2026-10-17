# 003. Authentication and onboarding — Spec

- **Status:** Draft
- **Requirements:** FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-07, FR-SET-03 (partial), BR-01, BR-05, BR-06, BR-10, NFR-03
- **Related:** [user flows](../../product/user-flows.md), [ADR 0006](../../decisions/0006-auth-google-jwt-cookies.md), [ADR 0007](../../decisions/0007-single-users-table.md), [ADR 0009](../../decisions/0009-geocoding-georef.md), [ADR 0010](../../decisions/0010-image-storage-r2.md)

## Summary

Users sign in with Google and, on their first visit, complete onboarding as a client or as a professional.

## Motivation

Every other feature needs an identified user with an address (for proximity) and, for professionals, categories, availability and a base address.

## User stories

- As a **visitor**, I want to sign in with my Google account, so that I don't have to create a password.
- As a **new user**, I want to say whether I offer services, so that the app asks me only for the data I need.
- As a **new client**, I want to enter my name, phone and address, so that I can find professionals near me.
- As a **new professional**, I want to enter my categories, schedule, base address and license, so that clients can find and book me.
- As a **new user**, I want to use my Google photo or upload another one, so that others recognize me.
- As a **user**, I want to stay signed in on my device, so that I don't have to sign in every time I open the app.
- As a **user**, I want to sign out, so that nobody else uses my account on a shared device.

## Acceptance criteria

### Sign-in and session

- **AC-1** — Given a visitor, when they complete Google sign-in for the first time, then a user is created with email, Google id, name and photo from Google, and they are sent to the "¿Sos profesional?" step.
- **AC-2** — Given a visitor, when they cancel Google sign-in or it fails, then they return to Login with an error message and no user is created.
- **AC-3** — Given a returning user who completed onboarding, when they sign in, then they land on Home (client) or Professional home (professional) without seeing onboarding again.
- **AC-4** — Given a user who signed in but didn't finish onboarding, when they sign in again or open any page, then they are taken to the "¿Sos profesional?" step. Nothing is saved until the final form is submitted, so onboarding starts over.
- **AC-5** — Given a signed-in user, when they come back to the app within 30 days of their last use, then they are still signed in; every use renews those 30 days. After 30 days without use, they are sent to Login.
- **AC-6** — Given an unauthenticated visitor, when they open any page other than Login, the Terms and Conditions or the Privacy Policy, then they are redirected to Login.
- **AC-7** — Given an authenticated user on Home or Professional home, when they tap their avatar, then Settings opens; when they choose "Cerrar sesión" there, then their session cookies are cleared and protected pages redirect to Login.

### Onboarding forms

- **AC-8** — Given the client form, when the user submits first name, last name, phone, photo and an address, and accepts the Terms and Conditions and the Privacy Policy, then the data is saved, the address becomes their first property with coordinates, and they land on Home.
- **AC-9** — Given the professional form, when the user submits their personal data, address, base address, at least one category and their schedule, and accepts the Terms and Conditions and the Privacy Policy, then the personal data is saved, the address becomes their first property, a professional profile is created with the base address, categories, license and bio, and they land on Professional home.
- **AC-10** — Given the professional form, when it opens, then the schedule is prefilled with Monday–Friday 08:00–16:00 (`BR-05`), and the base address copies the address entered in the same form and keeps following it while the user hasn't edited the base address. Once edited, it no longer changes with the address. Both can be edited before submitting.
- **AC-11** — Given either form, when the legal checkbox (Terms and Conditions and Privacy Policy) is not ticked, then the form cannot be submitted, and the API rejects the request with a `400` if called directly. The accepted version of the documents and the date of acceptance are stored with the user (`FR-AUTH-07`).
- **AC-12** — Given either form, when it opens, then the photo is prefilled with the Google photo; the user can replace it with an image of their own, which is reduced before upload, and the one shown on submit is saved as their photo. A file that is not an image is rejected with an error.

### Validation

- **AC-13** — Given invalid data (see Field limits: empty or too long name, empty or invalid phone, too long bio, invalid license number), when the form is submitted, then field-level errors appear, and the API rejects the same data with a `400` if called directly.
- **AC-14** — Given the phone field, when the user enters an Argentine number with area code in any common format (`11 1234-5678`, `0351 15 123-4567`, `+54 9 11 1234-5678`), then it is accepted and stored in a single normalized format; a number without area code or from another country is rejected (AC-13).
- **AC-15** — Given the professional schedule, when two ranges on the same day overlap or a range ends at or before its start, then the form shows an error and nothing is saved; the API rejects the same data with a `422` if called directly (`BR-06`).
- **AC-16** — Given the professional form with a category that requires a license (gas fitter), when the license number is empty, then the form shows an error and nothing is saved; the API rejects the same data with a `422` if called directly (`BR-10`).

### Addresses

- **AC-17** — Given any address in onboarding (the user's address and, for professionals, the base address), when the user confirms street, number, locality and province, then the matching normalized addresses are listed and the user picks one; that one is saved with its coordinates. If none matches, an error asks them to correct the address and the form cannot be submitted.
- **AC-18** — Given the geocoding service is unavailable, when the user confirms an address, then an error asks them to retry later and nothing is saved.

## Business rules

- `BR-01` — Being a professional means having a professional profile. Onboarding as a professional adds that profile to the user created at sign-in; the same user can still act as a client.
- `BR-05` — A new professional profile starts with Monday to Friday, 08:00–16:00, prefilled in the schedule step.
- `BR-06` — The schedule can have several ranges per day; ranges on the same day cannot overlap and each one must start before it ends.
- `BR-10` — If any selected category requires a license (e.g. gas fitter), the license number is required.

## Field limits

| Field | Rule |
|---|---|
| First name, last name | Required, 1–50 characters after trimming spaces. |
| Phone | Required, Argentine number with area code (AC-14). |
| Street | Required, 1–100 characters. |
| Number | Required, whole number from 1 to 99999. |
| Locality, province | Required, 1–100 characters. |
| Bio | Optional, up to 500 characters. |
| License number | Required only for categories that need one (`BR-10`), 1–20 characters: letters, digits, spaces, `-`, `.` and `/`. |
| Photo | WebP or JPEG, up to 1 MB after compression (ADR 0010). |
| Categories | At least one. |

## UI / UX

- Login: product logo/name and "Continuar con Google". Error message if sign-in is cancelled or fails.
- Step 1: "¿Sos profesional?" — two options: "Busco un profesional" / "Soy profesional".
- Step 2a (client): photo (prefilled from Google, "Cambiar foto" to upload another), first name, last name, phone + address.
- Step 2b (professional): the same personal data and address + base address (prefilled with the address) + categories (multi-select) + weekly schedule (prefilled) + license (shown when needed) + bio (optional, with a character counter).
- Both steps end with a single checkbox: "Acepto los Términos y Condiciones y la Política de Privacidad". Each name links to its page, which opens without losing the form. Both pages are public and use placeholder text until the final text is provided.
- Phone: hint with an example including the area code (e.g. "11 1234-5678").
- Address: street, number, locality and province fields, then "Buscar dirección" lists the matches to pick one (no autocomplete while typing, see ADR 0009). Loading state while searching; errors when nothing matches or the service is down.
- Loading state on submit; field errors in Spanish.
- Settings, opened from the avatar on Home and Professional home: in this feature it only has "Cerrar sesión". This covers the avatar → Settings part of `FR-SET-03`; editing personal data and addresses is added in 010.

## Out of scope

- Switching from client to professional after onboarding (`FR-AUTH-06`, P2).
- License verification (badge) — only the number is stored.
- Email/password login.
- Phone numbers from other countries.
- Editing personal data, addresses or the professional profile after onboarding (`FR-SET-*`, `FR-PROF-*`).
- Final legal text. The pages ship with placeholder text; the real text must replace it before there are real users.
- Asking existing users to accept a new version of the legal documents. The stored version and date allow adding it later.

## Open questions

None for now.
