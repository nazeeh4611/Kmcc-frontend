# Global KMCC Anganganadi Panchayath — Frontend

Next.js 15 (App Router) + React 19 + TypeScript. This is the **frontend
foundation** phase: project scaffold, design system, API integration layer,
and a fully working auth flow (admin login, member login, public
registration) wired to the Phase 1–3 backend. The full public landing page
and the admin/member dashboards are the next build phase.

## Verified

- `npm run build` — clean production build, all 7 routes compile and
  prerender (verified in this environment with Google Fonts network calls
  stubbed, since sandboxed CI here can't reach `fonts.googleapis.com` — this
  will resolve normally on Vercel/any environment with internet access).
- `npx tsc --noEmit` — no type errors.
- `npx next lint` — no lint errors.
- Shipped on **Next.js 15.5.18 / React 19.2.1** specifically because earlier
  15.x minors (including the initially-scaffolded 15.1.4) are affected by
  the December 2025 React Server Components RCE (CVE-2025-66478 /
  CVE-2025-55182) and follow-up DoS/source-exposure CVEs — 15.5.18 is the
  first 15.x minor with all of them patched.

## Setup

```bash
cp .env.example .env.local
# point NEXT_PUBLIC_API_URL at your running backend, e.g. http://localhost:5000/api

npm install
npm run dev   # http://localhost:3000
```

You'll need the backend running (see the backend README) with at least one
Zone and Coordinator seeded, or the registration form's dropdowns will be
empty.

## What's included in this phase

- **Design system** (`tailwind.config.ts`, `src/styles/globals.css`): the
  spec's color palette (`primary #0B5D1E`, `secondary #14532D`,
  `accent #84CC16`, `surface #F8FAFC`, `dark #071A0C`) as Tailwind tokens,
  three-typeface system (Plus Jakarta Sans for display, Inter for body,
  Manrope for utility/data), glassmorphism utilities (`.glass`,
  `.card-premium`), soft gradient mesh background, premium shadow scale,
  reduced-motion support, and visible focus rings baked into the base layer.
- **UI primitives** (`src/components/ui`): Button, Card, Input, Label, Alert
  — hand-authored in the shadcn/ui convention (Radix + `class-variance-authority`)
  so the rest of the shadcn ecosystem drops in the same way.
- **API client** (`src/lib/apiClient.ts`): Axios instance with
  `withCredentials: true` for the backend's HTTP-only cookies, and a
  response interceptor that transparently calls `/auth/refresh` on a 401 and
  retries the original request once (shared in-flight refresh so concurrent
  401s don't trigger a refresh storm).
- **Server state**: TanStack Query provider (`src/lib/queryProvider.tsx`) +
  an `AuthProvider` (`src/store/authContext.tsx`) that wraps the session
  query and exposes `useAuth()` (`session`, `isAuthenticated`, `logout`).
- **Auth flows**: admin login, member login (by Membership ID), and the
  public membership **registration form** — built field-for-field from the
  KMCC form you shared (Zone/Panchayath + "Not in list", Native Place,
  Coordinator + "Not in List", Working Country, Mandalam Committee, Name,
  Mobile with country code, optional Email, 4-digit Birth Year, photo) —
  all validated with Zod schemas that mirror the backend validators.
- **Route protection**: `middleware.ts` does a fast cookie-presence check
  for `/admin/*` and `/dashboard/*`; `admin/layout.tsx` and
  `dashboard/layout.tsx` additionally verify the session type client-side
  (via `/auth/me`) and redirect if a member hits an admin route or vice
  versa.
- **Folder architecture**: `app/ components/ features/ hooks/ lib/
  services/ store/ types/ utils/ styles/`, matching the spec.

## Folder structure

```
src/
  app/              Routes: /, /login, /register, /admin/login,
                     /admin/dashboard, /dashboard
  components/ui/    Design-system primitives (button, card, input, label, alert)
  features/auth/    Login + registration form components
  hooks/            useAdminLogin, useMemberLogin
  lib/              apiClient, queryProvider, utils (cn), validators/
  services/         authService, publicService (typed API calls)
  store/            authContext (session state)
  types/            Shared TS types mirroring the backend models
  styles/           globals.css (design tokens, glass/gradient utilities)
  middleware.ts     Route protection
```

## Next phase

The public landing page (hero, about, stats, committee, posters, gallery,
news, events, sponsors, testimonials, FAQ, contact) and the full admin +
member dashboards (all the CRUD screens, analytics, membership card
download UI, etc.) on top of this foundation.
# Kmcc-frontend
