# Web Blogs Design System

## 1. Atmosphere & Identity

Web Blogs feels like a calm editorial dashboard: crisp, direct, and lightly elevated, with enough structure to support writing and administration without visual noise. The signature is slate-and-blue clarity over soft white surfaces, paired with compact cards and restrained motion.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|---|---|---|---|---|
| Surface / primary | `--surface-primary` | `#ffffff` | `#020617` | Page chrome, hero surfaces |
| Surface / secondary | `--surface-secondary` | `#f8fafc` | `#0f172a` | App background, editorial panels |
| Surface / elevated | `--surface-elevated` | `#ffffff` | `#111827` | Cards, dialogs, preview panes |
| Text / primary | `--text-primary` | `#0f172a` | `#f8fafc` | Headings, body text |
| Text / secondary | `--text-secondary` | `#475569` | `#cbd5e1` | Metadata, helper copy |
| Border / default | `--border-default` | `#e2e8f0` | `#334155` | Dividers, outlines |
| Border / subtle | `--border-subtle` | `#f1f5f9` | `#1e293b` | Soft separations |
| Accent / primary | `--accent-primary` | `#2563eb` | `#60a5fa` | CTAs, links, active states |
| Accent / hover | `--accent-hover` | `#1d4ed8` | `#93c5fd` | Hover states |
| Status / success | `--status-success` | `#16a34a` | `#4ade80` | Success feedback |
| Status / warning | `--status-warning` | `#d97706` | `#fbbf24` | Warnings, draft emphasis |
| Status / error | `--status-error` | `#dc2626` | `#f87171` | Destructive actions, validation |

### Rules

- Surfaces separate mostly through tonal shifts and subtle elevation.
- Accent blue is reserved for interaction, navigation, and active states.
- No unapproved colors outside this table.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| Display | 48px / 3rem | 700 | 1.1 | -0.025em | Hero titles |
| H1 | 36px / 2.25rem | 700 | 1.2 | -0.02em | Page headers |
| H2 | 28px / 1.75rem | 600 | 1.3 | -0.015em | Section headers |
| H3 | 24px / 1.5rem | 600 | 1.4 | -0.01em | Card titles |
| Body / lg | 18px / 1.125rem | 400 | 1.6 | 0 | Editorial lead |
| Body | 16px / 1rem | 400 | 1.6 | 0 | Default text |
| Body / sm | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.02em | Labels, metadata |

### Font Stack

- Primary: `Geist, Arial, sans-serif`
- Mono: `Geist Mono, monospace`

### Rules

- Keep headings compact and high-contrast.
- Body text should stay readable and quiet.
- No third font family unless the product direction changes.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Inline spacing |
| `--space-3` | 12px | Dense form spacing |
| `--space-4` | 16px | Default component spacing |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section gaps |
| `--space-12` | 48px | Major separation |
| `--space-16` | 64px | Page rhythm |
| `--space-24` | 96px | Hero padding |

### Grid

- Max content width: 1200px
- Column system: 12-column layout with 24px gutters
- Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px

### Rules

- No magic spacing values outside the 4px rhythm.
- Dense data views should use tight grouping, not extra containers.

## 5. Components

### App Shell
- **Structure:** sticky top bar, content container, footer
- **Variants:** public shell, admin shell
- **Spacing:** `--space-6`, `--space-8`, `--space-12`
- **States:** default, scrolled, active nav
- **Accessibility:** semantic landmarks, visible focus states

### Elevated Card
- **Structure:** surface, header, content, actions
- **Variants:** blog card, preview panel, form card
- **Spacing:** `--space-4`, `--space-6`
- **States:** hover lift, focus ring, loading
- **Accessibility:** keyboard focus, contrast-safe text

### Form Stack
- **Structure:** label above input, helper text below
- **Variants:** single field, grouped fields, editor field
- **Spacing:** `--space-3`, `--space-4`
- **States:** default, focus, error, disabled
- **Accessibility:** explicit labels, helper/error association

### Rich Text Editor Shell
- **Structure:** toolbar, editable canvas, live preview panel
- **Variants:** compact, split-view
- **Spacing:** `--space-3`, `--space-4`, `--space-6`
- **States:** default, focused, empty, content-rich, error
- **Accessibility:** keyboard-shortcut friendly toolbar, labeled editor region

### Article Preview Pane
- **Structure:** title, media, body HTML, metadata chips
- **Variants:** full preview, content-only preview
- **Spacing:** `--space-4`, `--space-6`, `--space-8`
- **States:** empty, populated, image-rich
- **Accessibility:** semantic article content, readable heading hierarchy

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|---|---|---|---|
| Micro | 120ms | ease-out | Buttons, toggles |
| Standard | 220ms | ease-in-out | Panels, hover lift |
| Emphasis | 320ms | cubic-bezier(0.16, 1, 0.3, 1) | Page section entry |

### Rules

- Animate only `transform`, `opacity`, and `filter`.
- Every interactive element gets hover, focus, and active feedback.
- Keep motion restrained and useful.

## 7. Depth & Surface

### Strategy

Shadows

| Level | Value | Usage |
|---|---|---|
| Subtle | `0 1px 3px rgba(15, 23, 42, 0.10)` | Resting cards |
| Default | `0 10px 15px rgba(15, 23, 42, 0.10)` | Hovered cards |
| Prominent | `0 20px 40px rgba(15, 23, 42, 0.12)` | Elevated preview surfaces |

### Rules

- Shadows should stay soft and low-contrast.
- Avoid border clutter when elevation already communicates hierarchy.
