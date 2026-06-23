# Implementation Plan - Web Blogs Application (Completed)

This plan outlines the architecture, libraries, structure, and implementation details for the Web Blogs application as per the completed assignment.

## 1. Installed Libraries & Rationale

| Library | Purpose | Rationale |
|---|---|---|
| **`@tanstack/react-query`** | Server State Management | Caches blog lists, comments, and admin data. Handles pagination, search queries, and cache invalidation. |
| **`axios`** | HTTP Client | Simplifies API requests to BFF routes and backend. |
| **`next-auth`** | Authentication | Secures the admin panel via session middleware and provides robust admin token management. |
| **`react-hook-form`** | Form Management | Manages form state for creating/updating blogs and submitting comments. |
| **`zod`** | Schema Validation | Provides strict type safety and schema validation. |
| **`@hookform/resolvers`** | Form-Validation Integration | Bridges Zod validation schemas into React Hook Form. |
| **`@mui/material` & `@mui/icons-material`** | Component UI Library | Replaces custom CSS components with Material UI v6 Grid2 layouts. |

---

## 2. Directory Structure

```txt
src/
├── app/                  # Next.js Pages & API routes
│   ├── admin/            # Admin Panel
│   │   ├── login/        # Admin Login Page
│   │   ├── blogs/        # Admin Blogs Management (CRUD)
│   │   │   └── [id]/     # Edit Blog Page
│   │   │   └── create/   # New Blog Page
│   │   ├── comments/     # Comment Moderation Page
│   │   ├── layout.tsx    # Admin Dashboard Layout (Sidebar + Auth Check)
│   │   └── page.tsx      # Admin Dashboard Home (Blogs list table)
│   ├── blogs/            # Public Blog
│   │   └── [slug]/       # Blog Detail page (includes Comments and Gallery)
│   ├── api/              # Backend BFF Proxy Endpoints
│   │   ├── auth/         # NextAuth endpoint handler
│   │   ├── blogs/        # Blogs endpoint proxies
│   │   │   └── [id]/     # Edit/Delete blog proxy
│   │   │   └── [id]/comments # Submit comment proxy
│   │   │   └── [id]/publish # Publish toggle proxy
│   │   │   └── detail/[slug] # Public blog detail slug proxy
│   │   └── comments/     # Comments list proxy (Admin only)
│   │       └── [id]/approve # Approve comment proxy
│   │       └── [id]/reject # Reject comment proxy
│   ├── layout.tsx        # Global Layout
│   └── page.tsx          # Public Blog List (with Search & Pagination)
├── components/           # Reusable Components
│   └── providers/        # Client providers (ReactQuery, MUI Theme, AuthSession)
├── lib/                  # Library configs
│   ├── auth.ts           # NextAuth configs
│   ├── axios.ts          # Axios base client
│   ├── backendAxios.ts   # Axios backend client targeting NestJS on port 3001
│   ├── theme.ts          # MUI custom palette and component styles
│   └── validations.ts    # Zod validation schemas
└── types/                # Pure TypeScript Interfaces (NO `any`)
    ├── blog.ts
    └── comment.ts
```

---

## 3. Data Integration & Validation

- **NestJS API Backend Integration**: Integrates directly with the real API backend on `http://localhost:3001/api/v1`.
- **Next.js BFF Pattern**: Next.js route handlers act as secure proxies that attach the admin `accessToken` for protected requests.
- **Thai Language Comment Validation**: Zod schema uses the regex `/^[ \u0e00-\u0e7f0-9\s\.\,\?\!\-\(\)]*$/` to ensure comment messages contain only Thai letters and numerals.
- **No `any` Types**: TypeScript strictly typed to ensure reliability and safety.
