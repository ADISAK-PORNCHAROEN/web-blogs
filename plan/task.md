# Task List - Web Blogs Application Implementation (Completed)

This checklist tracks the progress of the assignment implementation.

## Phase 1: Setup & Data Modeling
- [x] Install dependencies (`@tanstack/react-query`, `axios`, `next-auth`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`)
- [x] Define TypeScript interfaces in `src/types/` (No `any` types allowed)
  - [x] `blog.ts` (id, title, content, coverImage, additionalImages, views, slug, published, createdAt, updatedAt, deletedAt)
  - [x] `comment.ts` (id, senderName, content, approved, createdAt, updatedAt, deletedAt)
- [x] Connect NestJS backend API on port 3001 (No data mocking required)

## Phase 2: API Endpoints Development
- [x] NextAuth route `src/app/api/auth/[...nextauth]/route.ts` & config
- [x] Blog API Routes:
  - [x] `GET /api/blogs` (Support query parameters for pagination, searching title, and admin view vs public view)
  - [x] `POST /api/blogs` (Create blog - Admin only)
  - [x] `GET /api/blogs/[id]` (Retrieve single blog - Admin view)
  - [x] `PATCH /api/blogs/[id]` (Update blog slug, content, titles, publish state, images - Admin only)
  - [x] `DELETE /api/blogs/[id]` (Delete blog - Admin only)
  - [x] `GET /api/blogs/detail/[slug]` (Retrieve single blog by URL Slug & increment views)
- [x] Comment API Routes:
  - [x] `GET /api/comments` (Fetch all comments - Admin only)
  - [x] `POST /api/blogs/[id]/comments` (Submit comment with Thai/number validation check)
  - [x] `PATCH /api/comments/[id]/approve` (Approve comment - Admin only)
  - [x] `PATCH /api/comments/[id]/reject` (Reject/unapprove comment - Admin only)

## Phase 3: Client Config & Global Wrappers
- [x] Configure Axios base instance (`src/lib/axios.ts` & `src/lib/backendAxios.ts`)
- [x] Configure React Query Provider and Auth Session Provider (`src/components/providers/`)
- [x] Configure MUI Theme Registry and CSS baseline
- [x] Update `src/app/layout.tsx` to include Providers

## Phase 4: Public View Pages
- [x] **Home Page (`src/app/page.tsx`)**
  - [x] Search input by title (with debounce)
  - [x] Paginated blog list (10 blogs per page, pagination navigation bar)
  - [x] Responsive grid design with Cover Image, Title, brief Content excerpt, and Post Date
- [x] **Blog Detail Page (`src/app/blogs/[slug]/page.tsx`)**
  - [x] Responsive layout displaying Title, Post Date, View Count, and Full Content
  - [x] Image Gallery (Cover image + up to 6 sub-images, interactive lightbox)
  - [x] Comment Submission form (`react-hook-form` + `zod` resolver) enforcing Thai-only/numbers validation
  - [x] List of approved comments (dynamic reload after submission)

## Phase 5: Admin Panel & Moderation
- [x] **Admin Login (`src/app/admin/login/page.tsx`)**
  - [x] Secure credentials input form
- [x] **Admin Dashboard Layout & Middleware (`src/app/admin/layout.tsx`)**
  - [x] Authentication guard protecting admin path
  - [x] Navigation sidebar (Blogs Management, Comments Moderation, Logout)
- [x] **Admin Blogs List (`src/app/admin/page.tsx`)**
  - [x] List of all blogs with quick toggle actions (Publish/Unpublish, Delete, Edit)
- [x] **Admin Blog Create/Edit (`src/app/admin/blogs/create/page.tsx` & `[id]/page.tsx`)**
  - [x] CRUD Forms with image URL inputs (cover + up to 6 additional fields)
  - [x] Edit URL Slug field with validation
- [x] **Admin Comment Moderation (`src/app/admin/comments/page.tsx`)**
  - [x] List of all submitted comments with sender, comment text, and status
  - [x] Approve and Reject actions (allowing reversal of approval status)

## Phase 6: Polish & Verification
- [x] Ensure full visual responsiveness on desktop, tablet, and mobile
- [x] Verify TypeScript compiles with no errors (and no `any` types)
- [x] Run production build `npm run build` to verify Next.js configuration is 100% correct
