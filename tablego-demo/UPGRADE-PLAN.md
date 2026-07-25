# Upgrade Plan: From Demo to SaaS Prototype

## Current Issues
1. UI is template-like, not real restaurant app
2. Customer & owner data not shared (no persistence)
3. Wrong table flow (user types table number)
4. Admin backend too basic

## What We'll Build

### 1. Unified Persistent Data Store
- `src/data/store.ts` — reads/writes to localStorage
- Orders, menu items, categories, tables all persist
- Both customer and admin read from same store

### 2. Redesigned Customer UI
- `RestaurantHeader` — real restaurant info bar
- `MenuPage` — horizontal category nav + product grid + cart sidebar
- `MenuCard` — smaller, more real, with add-to-cart
- Table number from URL `?table=A01`, never user-input

### 3. Admin Backend Upgrade
- CategoriesPage — CRUD for categories
- MenuManagePage — full CRUD (name, price, image, stock)
- TablesPage — list + QR link generation
- OrdersPage — order list with status flow

### 4. Data Flow
```
Customer: browse → add to cart → submit order → stored in localStorage
Admin: read orders from localStorage → mark processing/completed
Admin: edit menu/categories → stored in localStorage → customer sees changes on refresh
```

## Files to Create/Modify

### New Files
- `src/data/store.ts` — unified persistent store

### Major Rewrites
- `src/context/OrderContext.tsx` — use persistent store
- `src/pages/MenuPage.tsx` — new layout with RestaurantHeader
- `src/components/menu/MenuCard.tsx` — smaller, realistic
- `src/pages/admin/OrdersPage.tsx` — use persistent store
- `src/pages/admin/MenuManagePage.tsx` — full CRUD
- `src/pages/admin/CategoriesPage.tsx` — new CRUD page
- `src/pages/admin/TablesPage.tsx` — QR links
- `src/App.tsx` — new routes, table param

### Minor Updates
- `src/data/menu.ts` — simplified
- `src/data/translations.ts` — add admin keys
- `src/pages/WelcomePage.tsx` — simplified for demo