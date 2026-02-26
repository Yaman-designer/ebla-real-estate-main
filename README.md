# Newdeal Real Estate Frontend

React admin frontend (Steex template base) integrated with EspoCRM APIs.

## Tech Stack
- React 18 + TypeScript
- React Router v6
- Redux Toolkit (existing modules)
- React Bootstrap + SCSS theme
- Axios-based EspoCRM client
- TanStack Table for list/table views

## Local Setup
1. Install dependencies:
   - `npm install`
2. Configure environment (`.env`):
   - `REACT_APP_ESPOCRM_URL`
   - `REACT_APP_DEFAULTAUTH=espocrm`
3. Run development server:
   - `npm start`
4. Production build:
   - `npm run build`

## Current Architecture (CRUD)

### Generic CRUD engine
- `src/Common/EntityCrud/EntityCrudList.tsx`
  - Backend pagination/search/sort
  - Table + Grid view support
  - CRUD modal + delete flow
  - Floating toolbar support in grid mode
- `src/Common/UniversalList/ListView.tsx`
  - Server-side pagination/sorting hooks
  - Fixed next/previous behavior
  - Header sorting UI improvements
  - Loading overlays
- `src/Common/UniversalList/GridComp.tsx`
  - Grid rendering + pagination
  - Simplified pagination (`Previous | current/total | Next`)
- `src/pages/RealEstate/Shared/SimpleEntityCrudPage.tsx`
  - Lightweight page builder for rapid entity onboarding

### Espo auth behavior
- `src/helpers/espocrm/EspoCrmClient.ts`
  - Redirect to login on `401` only
  - `403` no longer forces logout

## Implemented Entity Pages

### Real Estate
- Requests: `/real-estate-request` -> `RealEstateRequest`
- Calls: `/call` -> `Call`
- Contracts: `/ebla-contract` -> `EblaContract`
- Contacts: `/contact` -> `Contact`
- FSBO: `/portals-properties` -> `PortalsProperties`
- Auction Properties: `/ceauction` -> `CEauction`
- References: `/creference` -> `CReference`
- Pipeline: `/cpipeline` -> `CPipeline`
- Tasks: `/task` -> `Task`
- Meetings: `/meeting` -> `Meeting`

### Company / Support
- Teams: `/team` -> `Team`
- Users: `/user` -> `User`
- Cases: `/case` -> `Case`

Routes are wired in:
- `src/Routes/allRoutes.tsx`

## Recent Functional Changes
- Capped list fetch size to max `200` to avoid Espo `403` on large `maxSize`.
- Requests/list pages now show warning + empty state on fetch failure instead of forced logout.
- Search and order-by moved to backend-driven flow in generic CRUD and property pages.
- ListingMap duplicate fetch effect removed.
- Requests page now supports list/grid toggle and floating toolbar behavior.

## Known Caveats
- `npm run build` succeeds but repository still has pre-existing warnings:
  - Unused variables in several legacy files
  - Existing PostCSS calc warning in `src/assets/scss/components/_progress.scss`
- Some Espo entities may require additional mandatory fields in create/update depending on server-side schema.

## How To Add A New Entity Page (Fast Path)
1. Create page file under `src/pages/RealEstate/<EntityPage>/<EntityPage>.tsx`.
2. Use `SimpleEntityCrudPage` with:
   - `entityType` (Espo API scope)
   - `columns` (list columns)
   - `formFields` (create/edit form)
   - `attributeSelect` (optimize payload)
   - `allowedPayloadFields` (safe write payload)
3. Add route in `src/Routes/allRoutes.tsx`.
4. If needed, add sidebar menu entry in `src/Layout/LayoutMenuData.tsx`.
5. Validate with `npm run build`.

## Useful Files
- `src/Common/EntityCrud/EntityCrudList.tsx`
- `src/pages/RealEstate/Shared/SimpleEntityCrudPage.tsx`
- `src/Common/UniversalList/ListView.tsx`
- `src/Common/UniversalList/GridComp.tsx`
- `src/Routes/allRoutes.tsx`
- `src/Layout/LayoutMenuData.tsx`
