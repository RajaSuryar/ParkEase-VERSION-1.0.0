# ParkEase QA checklist

Use this checklist on a physical Android and iOS device before each release candidate. Clear app storage when a fresh-install path needs testing; do not clear it for persistence tests.

## Authentication and startup

- [ ] Fresh install: splash, onboarding, mobile login and OTP are shown in order.
- [ ] Onboarding completion persists. A logged-out returning user starts at Login, not onboarding.
- [ ] A signed-in returning user reaches the main app without an auth/onboarding flash.
- [ ] Validate invalid phone, invalid OTP, resend OTP, profile creation and logout.
- [ ] Development only: use a valid 10-digit Indian phone number and OTP `123456`.

## Discovery and booking

- [ ] Test location granted, denied and unavailable; Home, search, results and map remain usable without permission.
- [ ] Check recent searches, Home/Work saved places, filters, sort, map/list selection and parking-detail back navigation.
- [ ] Test vehicle CRUD/default selection, date/time/duration, exact slot, Any Available Slot, unavailable slots and no availability.
- [ ] Check checkout total equals the payment button amount; test valid/invalid coupon and wallet insufficiency.
- [ ] Test payment success creates exactly one booking/payment/QR, and failure preserves the draft for retry.

## Parking lifecycle

- [ ] Validate QR reference, parking, vehicle, slot, entry/exit and status after reopening the app.
- [ ] Test Starts Soon, Active, Ending Soon and Expired. Background/reopen and restart must derive time from timestamps.
- [ ] Test extension eligibility, closing time/max-stay/availability validation, success, failure/retry and duplicate-payment protection.
- [ ] Check upcoming/active/completed/cancelled ordering, Book Again draft reset, cancellation policy, refund amount/persistence and no duplicate refund credit.

## Account features

- [ ] Check wallet balance/transactions/top-up, offers, favourites and notifications (read/unread, mark-all-read, routing).
- [ ] Test profile edit, saved-place Home/Work/custom CRUD, settings persistence, location settings and logout/delete-account confirmations.
- [ ] Test FAQ, support ticket creation, booking selection, generated reference, list, details and invalid ticket recovery.

## Release smoke checks

- [ ] Open every route from its intended in-app entry point and verify natural back navigation.
- [ ] Check small and large devices, keyboard forms, screen reader labels, reduce-motion preference and keyboard-safe scrolling.
- [ ] Confirm Android location permission wording, icons, splash, launch name and deep-link scheme.
- [ ] Run `npm run typecheck`, `npm run lint`, `npm run test --if-present`, `npx expo-doctor`, and `npx expo export --platform web`.

## Known test boundary

This repository has no automated test script or device test farm. The local desktop visual-runtime helper was unavailable during Phase 12, so physical-device Android/iOS, accessibility, network-failure and store-submission checks are still required.
