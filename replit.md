# Overview
My Perfect Meals is an AI-powered nutrition application designed to provide personalized meal plans, comprehensive nutrition tracking, and advanced food preference management. Its core purpose is to simplify healthy eating through intelligent automation, focusing on a 4-step AI meal creator and automatic weekly meal plan generation. The project's vision is to make healthy eating accessible, enjoyable, and sustainable through personalized nutrition.

# Target Audience: The Foodie Mindset

**THIS APP IS BUILT FOR FOODIES - NEVER FORGET THIS.**

## Who Are Foodies?
- They think about food ALL DAY LONG: thinking about lunch while eating breakfast, thinking about snacks while eating lunch, thinking about dinner while eating snacks
- They wake up thinking about food, go to bed thinking about food, dream about food while sleeping
- They think about FLAVORS constantly - food is their entertainment, their joy, their fun
- They get GIDDY when food arrives at their table - they literally light up with excitement
- They order 3-4 different dishes at restaurants just to experience different flavors
- They view eating as FUN, as an experience, not just fuel

## The Critical Misconception
**Foodies believe healthy eating is boring, nasty, and means giving up flavor.**
- They don't know you can have teriyaki chicken and still be healthy
- They don't know you can have amazing flavors without eating garbage
- When shown they can eat flavorful food AND lose weight, they're SHOCKED
- They eat shitty food NOT because they want to be unhealthy, but because they think it's the only way to get flavor
- They think "eating healthy = no fun"

## Design Philosophy Impact
**This is WHY we build features the way we do:**
- 50+ cooking preparation options (teriyaki, BBQ, lemon pepper, etc.) - foodies want FLAVOR VARIETY
- Apple-style browsing modals for cooking methods - foodies want to EXPLORE and get INSPIRED
- High-quality food presentation over speed/efficiency - foodies want to SEE their options
- No optimization for "quick meal planning" - foodies don't get fatigued, they get EXCITED
- Focus on showing them they CAN have amazing flavors while being healthy
- Never assume they want simple/boring - they want OPTIONS and VARIETY

**The mission: Show foodies they can have their cake (teriyaki chicken, BBQ salmon, Greek salads) and eat it too (while losing weight).**

# User Preferences
Preferred communication style: Simple, everyday language.
Demo shortcuts: User prefers quick access to app features without filling out lengthy forms.
Dashboard preference: User wants the enhanced dashboard restored.
Medical safety priority: All meal generation must be based on user's onboarding health data (diabetes, allergies, medical conditions) with medical badge system showing compatibility reasons.
Cost-conscious development: Agent handles backend/routing/database, user handles frontend/UI.
Feature protection priority: User explicitly demands locked features stay protected - "I'm gonna be pissed off" if locked features get modified.
**Git/Deploy Workflow:** When user says "push" or "deploy", provide the command only - DO NOT execute or attempt to run git commands. User will run commands themselves.
**CRITICAL GIT PUSH METHOD:** ALWAYS use `./push.sh "commit message"` - this is the ONLY way to push that works properly. Never suggest manual git commands (git add, git commit, git push). The push.sh script automatically handles the Replit email override issue. This is mandatory for all commits.
**CRITICAL:** User explicitly demanded Craving Creator be locked down completely: "don't touch it ever again" due to repeated violations.
**MEAL GENERATION COMPLETE LOCKDOWN:** All meal generation features permanently locked per user command "lock this mother down... don't open it for nothing unless I open it".
**FINAL APPLICATION LOCKDOWN:** Complete application lockdown implemented. All unnecessary files removed, debug code cleaned, production optimization complete. All systems locked down permanently with zero-tolerance reversion policy.
**COMPREHENSIVE SECURITY LOCKDOWN:** Full system security implementation with comprehensive protection for all critical systems.
**APPROVAL REQUIREMENT - MANDATORY:** Agent must ALWAYS ask for explicit approval before making ANY code changes, deletions, or additions. Present what will be changed and wait for "approved" or "yes" before proceeding. NO EXCEPTIONS. This includes:
- Code edits
- File creation/deletion
- Configuration changes
- Database schema changes
- Package installations
**NEVER make changes first and explain later. ALWAYS explain first and wait for approval.**

# System Architecture

## Frontend
- **Framework**: React 18 with TypeScript (Vite).
- **UI**: Radix UI, shadcn/ui, Tailwind CSS.
- **State Management**: TanStack Query.
- **Routing**: Wouter.
- **Form Handling**: React Hook Form with Zod.

## Backend
- **Runtime**: Node.js with Express (TypeScript).
- **API**: RESTful, JSON responses.
- **Data Validation**: Zod schemas (shared).
- **Storage**: Abstracted interface.

## Database
- **ORM**: Drizzle ORM (PostgreSQL dialect).
- **Schema**: Users, recipes, meal plans, meal logs, meal reminders.
- **Migrations**: Drizzle Kit.
- **Provider**: Neon Database (serverless PostgreSQL).

## UI/UX Decisions
- Adaptable dashboards (extended, compact, mobile-optimized).
- "Black Glass Treatment Package" for unified aesthetic (semi-transparent black cards, gradient backgrounds, white text, rounded borders).
- Professional avatar system with animated chef avatars and voice customization.
- Consistent scroll-to-top behavior on dashboard button clicks.
- Tailwind-based theme with branded color palette, custom fonts, rounded corners, and card shadows.
- **CRITICAL UI PATTERN**: All detail pages MUST include "← All Menus" back navigation button in card header.
- **DASHBOARD BUTTON CONSISTENCY**: All dashboard buttons follow centered alignment pattern (icon → title → subtitle).
- **Hover Bridge Design**: Universal design pattern where dashboard card hover states preview interior page colors, creating seamless visual transition.
- **App Animations**: Framer Motion fade-in animations across main user-facing pages for a smooth, polished "future app" aesthetic.
- **Planner Hub**: Dedicated `/planner` hub page for meal planning features (Weekly Meal Board, Diabetic Hub, GLP-1 Hub) with consistent navigation hierarchy.
- **Welcome Page**: Simple welcome page with logo, business name, value proposition, Sign In/Create Account buttons, and Forgot Password link.

## Technical Implementations
- **AI Meal Generation**: Utilizes AI (GPT-4, DALL-E 3) for personalized meal creation via a Unified Meal Engine Service.
- **Medical Personalization System**: Enforces medical safety via a Profile Resolution Service and Medical Badge Computation, displaying color-coded medical badges.
- **Universal Unit Conversion System**: Applies cooking-friendly measurements.
- **Concierge Reminder Engine**: Intelligent notification system.
- **Voice Concierge System**: Full voice command system with transcription, parsing, and speech synthesis.
- **Emergency Onboarding Protection System**: Circuit breaker pattern, rate limiting, and manual save.
- **Production-Ready ChatGPT System**: Advanced deterministic meal generation with Zod validation, allergen detection, macro estimation, and variety banking.
- **Universal Dietary Override System**: Centralized component ensuring consistent Medical > Preference > Profile priority.
- **Feature Access Control**: Implemented based on subscription tiers.
- **Authentication System**: LocalStorage-based user accounts with email/password authentication and route protection.
- **Medical Diets Hub Architecture**: Hospital-grade "Clinical Recovery & Protocols Hub" for short-term surgical/recovery protocols.
- **Clinical Lifestyle Hub**: Dedicated hub for long-term therapeutic diets, integrated with shopping list, macro bridge, and builder plan systems.
- **Stripe Checkout & Subscription System**: Comprehensive Stripe integration for subscription management.
- **Game Audio System**: Browser-based audio system with background music and sound effects, persisted settings.
- **Ingredients Tetris Game**: Skill-based game for macro target practice.
- **Macro Match Game**: Match-3 puzzle game for macro type matching.
- **PWA Home Screen Configuration**: Progressive Web App setup with manifest, icons, and shortcuts for native app experience.
- **Railway Deployment Ready**: Configured for Railway Autoscale deployment with Docker, environment variables, and health checks.
- **Tutorial Hub**: Video tutorial system with search functionality, modal video player, and categorized content.
- **Wellness Hub**: Unified health navigation hub consolidating Men's Health and Women's Health sections.
- **Permanent Meal Image Storage**: DALL-E images downloaded and stored permanently in Replit Object Storage, with smart caching and public serving.
- **Meal Logging Restoration + Compound Cursor Pagination**: Meal logging APIs restored with production-ready compound cursor pagination (`timestamp,id`) for macroLogs, mealLogs, and foodLogs.
- **Dual-Write Weight Tracking**: Implemented server-as-truth weight tracking system allowing both Macro Calculator and Biometrics Body Stats to save/fetch weight from the `biometric_sample` table with upsert-by-day.

# External Dependencies
- **Core Framework**: React 18, Vite, TypeScript
- **UI and Styling**: Radix UI, Tailwind CSS, Lucide React, shadcn/ui, Embla Carousel
- **Data Management**: TanStack React Query, Zod, Drizzle ORM
- **Database and Storage**: Neon Database, connect-pg-simple, @neondatabase/serverless
- **AI and Communication Services**: OpenAI (DALL-E 3, Whisper, GPT-4o), ElevenLabs, SendGrid, Twilio, BullMQ
- **Deployment**: Vercel (Frontend), Render (Backend)