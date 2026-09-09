# ParkEase production readiness

## Current status

ParkEase is a high-fidelity MVP/prototype. It demonstrates a complete mobile parking journey with Expo Router, TypeScript, shared UI components, local persistence and deterministic mock data. It is not a public-production release build.

## Architecture and migration boundary

- **UI and routing:** `src/app` contains Expo Router routes; `src/components` contains shared views and controls.
- **State and persistence:** `src/store` owns app-facing state; `src/services/storage-service.ts` persists data using SecureStore with a web fallback.
- **Domain and presentation rules:** `src/types`, `src/utils`, `src/config`, and `src/theme` hold types, lifecycle/pricing rules, configuration and design tokens.
- **Mock backend boundary:** services in `src/services` are the intended API seam. Future integrations should replace service implementations, not screens.

Services that require real API counterparts include `authService`, `parkingService`, `bookingService`, `paymentService`, `walletService`, `notificationService`, `supportService`, `searchService`, `locationService`, `couponService`, `vehicleService`, `favoritesService` and `savedPlaceService`.

## Mocked systems

The following are local, simulated or static: OTP authentication/session, parking inventory/occupancy/availability, search/geocoding labels and location fallback, payment outcomes, refunds, wallet balance/ledger, coupons, notification delivery, support tickets, offers and saved/favourite parking data. Booking, pricing, slot assignment, cancellation and refund decisions are client-side demo logic.

No card numbers, CVVs, UPI PINs, bank credentials or payment-provider secret keys are persisted or committed. The development OTP hint is guarded for development builds. Real production auth must use a backend-issued secure session/token.

## Public-release blockers

1. Build and operate a backend that is authoritative for availability, price, slot assignment, booking creation, payment status, cancellation, refunds and any wallet balance.
2. Replace mock OTP with a real identity provider and server-issued sessions; add abuse/rate-limit controls.
3. Integrate real parking-provider inventory and live availability.
4. Integrate a PCI-appropriate payment provider, webhooks, reconciliation and real refund processing. Never trust a mobile client to confirm payment.
5. Add push-notification delivery, a real support channel, production network/error handling and monitoring.
6. Finalize lawyer-reviewed Terms, Privacy Policy and data-retention practices.
7. Provide Android package and iOS bundle identifiers, store metadata, privacy disclosures, signed EAS/build credentials and store-compliant screenshots. Do not commit signing credentials.
8. Complete physical-device regression, accessibility, network failure, performance and store-submission QA. Add an automated test suite for critical flows.

## Configuration review

`app.json` correctly references existing icons, splash assets and the `parkease` scheme; portrait orientation and static web export are configured. The only requested runtime capability is location, with clear nearby-parking wording. Android package and iOS bundle identifier are deliberately absent because no production identifier convention was supplied. There is no `eas.json`, build profile or signing configuration. No environment variables or secrets are presently required by the mocked architecture; introduce documented public variables only when a real integration consumes them, and keep secret values server-side.

## Non-blocking improvements

Add unit/integration tests for services and critical journeys, an error boundary/monitoring strategy, a runtime dark-theme implementation (the preference is persisted but the stable Phase 1 theme is currently light), localization beyond the future-facing Tamil preference, and production-grade offline/network states.
