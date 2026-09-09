# ParkEase

ParkEase is an Expo/React Native parking-app MVP. It demonstrates onboarding, mock mobile OTP auth, parking discovery, booking and payment flows, QR passes, active parking/extensions, booking history/refunds, wallet, favourites, notifications, saved places, profile/settings and support.

## Stack

Expo SDK 57, React Native, Expo Router, TypeScript, Zustand, Expo SecureStore and Expo Location. The web target is a static Expo export; mobile is the primary target.

## Run locally

```bash
npm install
npm start
# or: npm run android | npm run ios | npm run web
```

For development mock authentication, enter any valid 10-digit Indian phone number and OTP `123456`. This is not real authentication.

## Checks

```bash
npm run typecheck
npm run lint
npm run test --if-present
npx expo-doctor
npx expo export --platform web
```

## Key directories

- `src/app` — Expo Router screens and layouts
- `src/components` — shared UI, layout, booking and parking components
- `src/services` — persistence-backed service/API boundary
- `src/store` — app-facing state
- `src/types`, `src/utils`, `src/config`, `src/theme` — domain types, rules, configuration and design tokens
- `src/mock` — static demo parking/location data
- `docs` — manual QA and production-handoff documents

## Important limitation

This is a high-fidelity MVP/prototype. Authentication, parking availability, payments, refunds, wallet, notifications and support are local mock systems. See [production readiness](docs/PRODUCTION_READINESS.md) and the [QA checklist](docs/QA_CHECKLIST.md) before planning a public release.
