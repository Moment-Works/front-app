# Moment Works Constitution

<!-- 
Sync Impact Report:
Version: 1.0.0 (Initial Constitution)
Created: 2025-12-06
Modified Principles: N/A (new document)
Added Sections: All sections (initial creation)
Templates Status:
  ✅ plan-template.md - Aligned (Constitution Check section references this document)
  ✅ spec-template.md - Aligned (Requirements section compatible with principles)
  ✅ tasks-template.md - Aligned (Task organization supports principle compliance)
Follow-up TODOs: None
-->

## Core Principles

### I. Next.js 14+ App Router Mandatory

**Rule**: All new features and pages MUST use Next.js 14+ App Router architecture. Pages Router is strictly forbidden.

**Requirements**:

- Use `app/` directory structure exclusively
- Leverage Server Components by default; Client Components only when interactivity required
- Implement proper `layout.tsx` hierarchy for shared UI elements
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` for specialized states
- Follow App Router conventions for routing, data fetching, and metadata

**Rationale**: App Router represents the future of Next.js with better performance, streaming, and developer experience. Maintaining architectural consistency prevents technical debt and confusion.

---

### II. TypeScript Strict Mode (NON-NEGOTIABLE)

**Rule**: TypeScript strict mode MUST be enabled and enforced. All code MUST be fully typed with no `any` exceptions unless explicitly justified.

**Requirements**:

- `tsconfig.json` MUST have `"strict": true`
- No implicit `any` types allowed
- All function parameters and return types MUST be explicitly typed
- Use type guards and discriminated unions for complex types
- Props interfaces MUST be defined for all components
- External libraries without types MUST have custom type declarations

**Rationale**: Type safety prevents runtime errors, improves code maintainability, enables better IDE support, and serves as living documentation. Strict mode catches bugs at compile time rather than production.

---

### III. Performance First (NON-NEGOTIABLE)

**Rule**: All pages MUST meet performance benchmarks. Performance regressions are blocking issues.

**Mandatory Targets**:

- Lighthouse Performance Score: **90+ required**
- First Contentful Paint (FCP): **≤ 1.8 seconds**
- Largest Contentful Paint (LCP): **≤ 2.5 seconds**
- Cumulative Layout Shift (CLS): **≤ 0.1**
- First Input Delay (FID): **≤ 100ms**

**Implementation Requirements**:

- ALL images MUST use `next/image` component with proper width/height
- Images MUST be served in WebP format with appropriate quality settings
- Initial JavaScript bundle MUST be ≤ 200KB
- Use dynamic imports for heavy components
- Implement proper code splitting at route boundaries
- Leverage React Server Components for data-heavy UIs
- Use `loading.tsx` for streaming and progressive rendering

**Rationale**: Performance directly impacts user experience, SEO rankings, and conversion rates. Setting hard limits prevents gradual degradation and ensures consistent user experience.

---

### IV. UI Standards (NON-NEGOTIABLE)

**Rule**: Styling MUST use Tailwind CSS + shadcn/ui exclusively. Other CSS libraries and frameworks are forbidden.

**Requirements**:

- Use Tailwind utility classes for all styling
- Component library MUST be shadcn/ui only
- NO additional CSS frameworks (Bootstrap, Material-UI, Chakra, etc.)
- Custom components MUST follow shadcn/ui patterns and conventions
- Maintain consistent design tokens via Tailwind config
- Use CSS modules ONLY for truly exceptional cases (must be justified)

**Forbidden**:

- ❌ Styled-components, Emotion, or other CSS-in-JS libraries
- ❌ Component libraries other than shadcn/ui
- ❌ Inline styles (except for dynamic values that cannot be predetermined)
- ❌ Global CSS files beyond `globals.css` for foundational setup

**Rationale**: Single styling approach prevents bundle bloat, reduces decision fatigue, ensures design consistency, and leverages Tailwind's optimized production builds. shadcn/ui provides high-quality, customizable components without framework lock-in.

---

### V. Simplicity & Best Practices

**Rule**: Start simple and add complexity only when proven necessary (YAGNI - You Aren't Gonna Need It). All architectural decisions MUST be justified.

**Requirements**:

- State management: Use React Context or Zustand ONLY (Redux forbidden)
- Choose the simplest state solution that solves the problem
- Server state MUST be managed via React Server Components or Next.js data fetching
- Avoid premature abstractions and over-engineering
- File organization MUST follow Next.js conventions
- Component structure: Start with Server Components, add 'use client' only when needed
- Code reviews MUST challenge unnecessary complexity

**State Management Decision Tree**:

1. Can it be local component state? → Use `useState`
2. Needs sharing across few components? → Use React Context
3. Complex global state with middleware needs? → Use Zustand
4. **NEVER** use Redux unless extraordinary justification approved

**Rationale**: Complexity has maintenance costs. Starting simple allows natural evolution based on actual needs rather than anticipated requirements. React's built-in tools often suffice. When additional tools are needed, Zustand provides simplicity without Redux overhead.

---

## Technology Constraints

### Mandatory Stack

- **Framework**: Next.js 14+ (App Router required)
- **Language**: TypeScript 5+ with strict mode
- **Styling**: Tailwind CSS 4+
- **UI Components**: shadcn/ui
- **State Management**: React Context or Zustand only
- **Package Manager**: npm (as per project setup)

### Explicitly Forbidden

- ❌ Next.js Pages Router
- ❌ JavaScript (must use TypeScript)
- ❌ CSS frameworks other than Tailwind (Bootstrap, Material-UI, Chakra, etc.)
- ❌ Redux or Redux Toolkit
- ❌ CSS-in-JS libraries (styled-components, Emotion)
- ❌ Component libraries other than shadcn/ui

### Version Requirements

All dependencies MUST use compatible versions:

- Next.js: ≥14.0.0
- React: ≥18.0.0
- TypeScript: ≥5.0.0
- Tailwind CSS: ≥4.0.0

---

## Performance Standards

### Bundle Size Limits

- **Initial Load**: ≤ 200KB (gzipped JavaScript)
- **Route Chunks**: ≤ 100KB per route (excluding shared chunks)
- **Images**: Properly optimized via next/image with WebP format

### Monitoring & Validation

- Run Lighthouse CI on every PR
- Performance budgets enforced in CI/CD pipeline
- Bundle size analysis required for all releases
- Core Web Vitals must be monitored in production

### Image Optimization Requirements

```typescript
// ✅ CORRECT: Always use next/image
import Image from 'next/image'
<Image src="/photo.jpg" alt="Description" width={800} height={600} />

// ❌ WRONG: Never use raw img tags
<img src="/photo.jpg" alt="Description" />
```

### Code Splitting Strategy

- Use dynamic imports for modals, drawers, and heavy components
- Implement route-based code splitting automatically via App Router
- Lazy load below-the-fold content
- Use React.lazy() with Suspense for client components

---

## Governance

### Amendment Process

1. **Proposal**: Document proposed change with rationale in constitution PR
2. **Version Bump**: Determine MAJOR/MINOR/PATCH according to semantic versioning
3. **Impact Analysis**: Identify affected templates and code
4. **Approval**: Requires team consensus or project lead approval
5. **Migration**: Update all dependent templates and documentation
6. **Communication**: Announce changes to all team members

### Versioning Policy

- **MAJOR (X.0.0)**: Backward-incompatible principle removal or redefinition
- **MINOR (1.X.0)**: New principle added or material expansion of existing
- **PATCH (1.0.X)**: Clarifications, wording improvements, non-semantic changes

### Compliance Requirements

- All pull requests MUST verify compliance with this constitution
- Code reviews MUST reject violations regardless of functionality
- Complexity additions MUST be justified in PR descriptions
- Performance regressions are blocking issues
- Template consistency MUST be maintained across all `.specify/templates/` files

### Constitution Precedence

This constitution supersedes all other development practices, style guides, or conventions not explicitly documented herein. When conflicts arise, constitution principles take precedence.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
