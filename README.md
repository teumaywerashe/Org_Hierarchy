# PIS Employee Hierarchy

An organizational hierarchy management system built for **Perago Information Systems**. It consists of a NestJS REST API backend and a Next.js frontend that visualises the position tree with an interactive D3 diagram.

---

## Project Structure

```
/
├── perago-nestjs-api/       # Backend — NestJS + TypeORM + PostgreSQL
└── pis-employee-hierarchy/  # Frontend — Next.js + React + Redux + react-d3-tree
```

---

## Backend — `perago-nestjs-api`

### Tech Stack

- **NestJS** v8
- **TypeORM** v0.3 with **PostgreSQL**
- **Swagger** (auto-generated API docs at `/api`)
- **TypeScript**

### Setup

```bash
cd perago-nestjs-api
npm install
```

Create a `.env` file in the `perago-nestjs-api` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=orga_structure
```

Or use a full `DATABASE_URL` for a hosted database (e.g. Supabase):

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Running

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API starts on `http://localhost:3000` by default.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/positions` | Create a new position |
| `GET` | `/positions` | Get all positions (flat list) |
| `GET` | `/positions/tree` | Get positions as a nested hierarchy tree |
| `GET` | `/positions/:id` | Get a single position by ID |
| `GET` | `/positions/:id/children` | Get direct children of a position |
| `PUT` | `/positions/:id` | Update a position |
| `DELETE` | `/positions/:id` | Delete a position (only if it has no children) |

### Swagger Docs

Visit `http://localhost:3000/api` after starting the server for interactive API documentation.

### Data Model

**Position**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Auto-generated primary key |
| `name` | string (max 150) | Position title |
| `description` | text (nullable) | Optional description |
| `parentId` | UUID (nullable) | References parent position; `null` for root nodes |
| `children` | Position[] | Nested child positions (relation) |

### Running Tests

```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end tests
npm run test:cov      # coverage report
```

---

## Frontend — `pis-employee-hierarchy`

### Tech Stack

- **Next.js** 14 (App Router)
- **React** 18
- **Redux Toolkit** — global state management
- **Mantine** v7 — UI component library
- **react-d3-tree** v3 — interactive hierarchy tree visualisation
- **Axios** — HTTP client
- **React Hook Form** + **Yup** — form handling and validation
- **Tailwind CSS** — utility styling
- **TypeScript**

### Setup

```bash
cd pis-employee-hierarchy
npm install
```

Create a `.env` file in the `pis-employee-hierarchy` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Running

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

The app starts on `http://localhost:3001` (or the next available port).

### Features

- Interactive org chart rendered with `react-d3-tree` — pan and zoom supported
- Nodes display position name, description, and avatar initials
- Chevron indicator on nodes with children — click to expand or collapse
- Click a node card to view its full details in a modal
- Hover a node to reveal inline actions: add child, edit, delete
- Create, edit, and delete positions via modal forms
- Stats bar showing total positions and root count
- Notifications for all CRUD operations

### Key Components

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main page — layout, modals, data fetching |
| `src/components/OrgTree.tsx` | Tree wrapper using `react-d3-tree` |
| `src/components/OrgTreeNode.tsx` | Custom SVG node renderer |
| `src/components/orgTree.types.ts` | Shared TypeScript interfaces for the tree |
| `src/components/orgTree.utils.ts` | Helper functions (`toD3Node`, `buildFlatMap`) |
| `src/components/PositionForm.tsx` | Create / edit position form |
| `src/components/DeleteModal.tsx` | Delete confirmation modal |
| `src/store/positionSlice.ts` | Redux slice — async thunks and state |
| `src/services/positionService.ts` | Axios API calls |
| `src/types/position.ts` | TypeScript types for position data |

---

## Running Both Together

1. Start the backend:
   ```bash
   cd perago-nestjs-api && npm run start:dev
   ```

2. Start the frontend in a separate terminal:
   ```bash
   cd pis-employee-hierarchy && npm run dev
   ```

3. Open `http://localhost:3001` in your browser.
