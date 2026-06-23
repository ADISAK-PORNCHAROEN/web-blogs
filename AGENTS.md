<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Specific Guidelines: Web Blogs

## 1. Libraries Configuration
The project uses the following key libraries:
- **State Management & Caching**: `@tanstack/react-query` & `axios`
- **Authentication**: `next-auth` (for Admin Panel authentication)
- **Form Management**: `react-hook-form`
- **Schema Validation**: `zod` and `@hookform/resolvers/zod`
- **Icons**: `lucide-react`

## 2. Project Structure
Follow a modular project layout:
```txt
src/
├── app/                  # Next.js Pages & API routes
│   ├── admin/            # Admin pages (login, dashboards, blog management)
│   ├── blogs/            # Public blog details (/blogs/[slug] or /blogs/[id])
│   ├── api/              # API endpoints (auth, blogs, comments)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Public blog list with search and pagination
├── components/           # Reusable UI components
│   ├── ui/               # Base UI elements (button, input, etc.)
│   ├── blog/             # Blog-related components (BlogCard, BlogList)
│   ├── comment/          # Comment components (CommentForm, CommentList)
│   ├── admin/            # Admin-specific UI elements (Sidebar, list views)
│   └── providers/        # React Context Providers (Query, Auth)
├── hooks/                # Custom React hooks (fetching/mutating data)
├── lib/                  # Utility libraries & configurations
│   ├── axios.ts          # Axios instance configurations
│   ├── auth.ts           # NextAuth handlers & configuration
│   └── validations.ts    # Zod schemas for request validation
└── types/                # Strict TypeScript declarations (NO `any`)
```

## 3. Strict Coding Conventions
- **No `any` Types**: `any` is strictly prohibited. Every function parameter, state, response, and prop must have concrete types or interfaces defined in the `types/` directory or locally.
- **Thai & Numeric Comment Validation**:
  Comments must contain only Thai letters and numerals, Arabic numerals, space characters, and common punctuation marks.
  - Regex definition: `/^[ \u0e00-\u0e7f0-9\s\.\,\?\!\-\(\)]*$/`
- **Consistent Code Structure**: Use functional components with arrow functions and explicit return types (`React.FC` or return type annotation).
- **Responsive Layout**: Use Tailwind CSS for a premium look & feel with fluid columns and dark mode support.

