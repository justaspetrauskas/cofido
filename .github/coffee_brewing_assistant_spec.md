# ☕ Coffee Brewing Assistant — Product & UX Specification

## 1. Product Overview
A web-based guided coffee brewing assistant that helps users generate beginner-friendly coffee recipes and guides them step-by-step through brewing using timers, minimal UI, and calm visual feedback.

The experience should feel like a **ritual companion**, not a recipe app.

---

# 2. Core UX Principles
- One action per screen
- Minimal cognitive load during brewing
- Calm, slow, ritual-like pacing
- No clutter or competing UI elements
- Mobile-first experience

---

# 3. User Flows

## FLOW A — First-Time User Onboarding
1. Landing Page
   - CTA: Start Brewing

2. Method Selection
   - Pour-over
   - French Press
   - AeroPress
   - Espresso
   - Cold Brew

3. Optional Skill Level
   - Beginner (default)
   - Intermediate
   - Advanced

4. Equipment Checklist (optional)
   - Grinder
   - Kettle
   - Scale
   - Filters

5. Generate Recipe

→ Redirect to Recipe Preview

---

## FLOW B — Recipe Generation
1. Input configuration:
   - Brewing method
   - Cup size (1 / 2 / 4)
   - Strength slider (mild → strong)

2. Output:
   - Brew ratio
   - Grind size
   - Water temperature
   - Step sequence

3. CTA:
   - Start Brewing
   - Adjust Recipe

---

## FLOW C — Guided Brewing (Core Experience)
Each step is full-screen:

### Step Structure
- Title
- Short instruction (max 2 lines)
- Visual placeholder (3D object later)
- Timer (optional per step)
- Next button

### Step Flow Example
1. Heat water
2. Grind beans
3. Add coffee
4. Bloom (timer)
5. Pour in intervals
6. Finish

---

## FLOW D — Pause / Resume
- Auto-save current step
- Resume screen:
  - Continue brewing button
  - Shows current step + remaining timer

---

## FLOW E — Completion
- Celebration screen (subtle animation)
- Brew summary:
  - ratio
  - total time
  - grind size

- Feedback slider:
  - too weak → perfect → too strong

- Actions:
  - Save recipe
  - Brew again

---

## FLOW F — Returning User
- Home dashboard
- Continue last brew OR start new
- Saved recipes list

---

# 4. UI / DESIGN SYSTEM

## Color Palette
- Espresso: #3B2F2F
- Coffee Bean: #5A3E36
- Latte Cream: #F5E6D3
- Foam: #FAF3E8
- Caramel Accent: #C68B59
- Gold CTA: #D4A373

---

## Typography
- Headings: serif (warm, editorial feel)
- Body: clean sans-serif
- Minimal text density

---

## Layout Rules
- Mobile-first full-screen cards
- Single primary CTA per screen
- Large spacing and breathing room
- Soft shadows, rounded corners (16px+)

---

## Components
- StepScreen
- TimerRing
- RecipeCard
- MethodSelectorCard
- ProgressIndicator
- FeedbackSlider
- BrewButton

---

## 3D ICON SYSTEM (PLACEHOLDERS)
Future upgrade path:

| Object | Placeholder |
|--------|------------|
| Beans | sphere |
| Grinder | cube |
| Kettle | cylinder |
| Cup | hollow cylinder |
| Steam | animated blur lines |

---

## Animations
- Soft fade transitions between steps
- Steam-like floating motion
- Ripple effect for timer start
- Gentle scaling buttons

---

# 5. SYSTEM RULES
- Only one active step at a time
- Timer state persists across navigation
- No skipping unless user explicitly taps skip
- Keep instructions under 2 lines
- One primary CTA per screen

---

# 6. CTO RECOMMENDED TECHNOLOGY STACK

## Frontend
- **Next.js (App Router)** — main web framework
- **React** — UI layer
- **TypeScript** — type safety
- **Tailwind CSS** — styling system (fast iteration, design tokens)
- **Framer Motion** — animations (step transitions, timers)

---

## State Management
- **Zustand** — lightweight global state (brew session, timers)
- Optional: React Query (if backend APIs expand)

---

## Backend
- **Node.js (via Next.js API routes initially)**
- Later scale option:
  - **NestJS** (if complexity grows)

---

## Database
- **PostgreSQL** (primary relational store)
- ORM: **Prisma**

Stores:
- users
- recipes
- brew sessions
- equipment profiles

---

## Authentication
- **Clerk** or **Auth.js**
(simple login, no friction onboarding)

---

## Timers / Real-time
- Client-side timers (primary)
- Optional WebSockets later (live sync across devices)

---

## 3D / Graphics (future phase)
- **Three.js** (core 3D rendering)
- **React Three Fiber** (React integration)
- **Drei** (helpers for lighting & models)

---

## Hosting / Infra
- **Vercel** (frontend + serverless APIs)
- **Supabase** (optional backend alternative)
- CDN for assets (Cloudflare or Vercel Edge)

---

## Analytics
- **PostHog** (behavior tracking, funnel optimization)

---

## Optional Enhancements
- PWA support (offline brewing mode)
- Web Audio API (ambient coffee sounds)
- Haptics (mobile vibration feedback)

---

# 7. MVP BUILD ORDER (RECOMMENDED)
1. Landing + method selection
2. Recipe generator (static logic first)
3. Guided step screen (core loop)
4. Timer system
5. Completion screen
6. Save recipes (DB)

---

# 8. PRODUCT SUMMARY
This is a **ritual-based guided brewing system**, designed to reduce decision fatigue and help beginners produce consistent coffee through structured step-by-step interaction.

