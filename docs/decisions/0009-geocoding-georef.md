# 0009. Address geocoding with Georef

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

Onboarding (`FR-AUTH-03`, `FR-AUTH-04`) turns the user's address and the professional's base address into coordinates. They are stored permanently in `properties.location` and `professional_profiles.base_location`, because proximity search (`FR-SRCH-04`, `NFR-04`) runs PostGIS queries over them. The service must be free (principle VIII) and allow keeping the coordinates indefinitely. Phase 1 only serves Argentina.

## Decision

- Use **Georef** (`apis.datos.gob.ar/georef`), the Argentine government's public service for normalizing addresses. Its `/direcciones` resource takes street, number and optional province/locality, and returns the normalized address with approximate coordinates.
- The API calls Georef, not the browser. The web sends the address text to our API and gets back the candidate addresses; the user picks one and the API stores it.
- Geocoding lives behind a provider interface in the API, so it can be replaced without touching the web or the data model.

## Alternatives considered

- **Google Places Autocomplete** — best autocomplete UX, but the Google Maps Platform terms only allow caching latitude/longitude for 30 days. We need to keep them permanently for proximity search. It also requires a billing account.
- **Nominatim (public OpenStreetMap instance)** — free, but its usage policy forbids autocomplete and heavy use. Self-hosting it adds infrastructure cost.
- **OSM-based commercial providers (e.g. Geoapify)** — real autocomplete on a free tier, but storage rights for the results must be checked and they add a vendor account. Revisit if live autocomplete becomes a requirement.

## Consequences

- No live autocomplete while typing. The form asks for street, number and locality/province; on confirm it shows the matching addresses and the user picks one. No match → error, the user corrects the address.
- Coordinates are approximate (interpolated by street number). Good enough for distances of 1–50 km.
- Argentina only, consistent with the rest of Phase 1. Supporting other countries needs a new ADR.
- Georef is a public service without an SLA. If it fails, the address cannot be saved: the API returns a clear error and the user retries. Tests use a fake provider (`testing-strategy.md`).
- `properties` may need province/locality fields to store the normalized address; the 003 plan decides it and updates `database.md`.
