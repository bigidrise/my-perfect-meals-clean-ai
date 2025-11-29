# Overview
My Perfect Meals is an AI-powered nutrition application designed to provide personalized meal plans, comprehensive nutrition tracking, and advanced food preference management. Its core purpose is to simplify healthy eating through intelligent automation, focusing on a 4-step AI meal creator and automatic weekly meal plan generation. The project's vision is to make healthy eating accessible, enjoyable, and sustainable through personalized nutrition, specifically targeting "foodies" who prioritize flavor and experience over restrictive dieting. The application aims to demonstrate that healthy eating can be exciting, indulgent, and flavorful, inspiring users rather than instructing them.

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

### **MANDATORY APPROVAL WORKFLOW:**
Agent must ALWAYS ask for explicit approval before making ANY code changes, deletions, or additions. Present what will be changed and wait for "approved" or "yes" before proceeding. NO EXCEPTIONS. This includes:
- Code edits
- File creation/deletion  
- Configuration changes
- Database schema changes
- Package installations
**NEVER make changes first and explain later. ALWAYS explain first and wait for approval.**

### **PROTECTED ZONES:**
- **Production Features** - All current features locked (see LOCKDOWN.md for complete list)
- **Quarantined Features** - `/client/src/pages/_quarantine/` (obsolete, do not activate)
- **Future Features** - `/client/src/pages/_future/` (locked until launch)
- **Active Development** - Co-Pilot system only (currently approved for work)

### **CHANGE REQUEST PROCESS:**
1. User identifies feature needing changes
2. User explicitly states: "Unlock [FEATURE NAME] for changes"
3. Agent confirms unlock and proceeds with modifications
4. Agent completes work and requests re-lock
5. User approves re-lock

### **EMERGENCY FIXES:**
If a locked feature has a critical bug:
1. Agent identifies issue and reports to user
2. Agent requests emergency unlock for that specific feature only
3. User approves emergency unlock
4. Agent fixes ONLY the reported issue
5. Agent requests re-lock immediately

### **PROTECTED INVARIANTS:**
These are system-level rules that MUST NEVER be violated. Any code that violates these will cause regressions.

**COPILOT RESPECT GUARD (client/src/components/copilot/CopilotRespectGuard.ts):**
- Copilot MUST NEVER auto-open when user chose "Do-It-Yourself" mode (`coachMode === "self"`)
- Copilot MUST NEVER auto-open when user disabled the Guide toggle (`isGuidedModeEnabled === false`)
- ALL auto-trigger code paths MUST call `shouldAllowAutoOpen()` before opening Copilot
- This includes: page explanations, walkthrough launchers, intro flows, any future auto-trigger feature
- DO NOT BYPASS THIS GUARD - any violation causes the bugs reported on Nov 29, 2025

**COPILOT CLOSE CLEANUP (CopilotSheet.tsx):**
- When sheet closes, MUST stop microphone recording via `stop()`
- MUST clear pending recording timeouts
- MUST reset listening state
- DO NOT REMOVE the cleanup effect - prevents recording from continuing after close

### **DEPLOYMENT STRATEGY:**
Following professional software company best practices (Facebook/Twitter model):
- **Development (Current):** This Replit workspace - all changes happen here first
- **Staging (Beta Testing):** Separate deployment for trainers/doctors/clients to test
- **Production (January 2025):** Public App Store release

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
- "Black Glass Treatment Package" for a unified aesthetic.
- Professional avatar system, consistent scroll-to-top, and Tailwind-based theming.
- Critical UI patterns: "← All Menus" back navigation, centered dashboard buttons, and Hover Bridge design for seamless transitions.
- Framer Motion animations for a polished user experience.
- Dedicated `/planner` hub and a simple welcome page.

## Technical Implementations
- **AI Meal Generation**: AI-powered personalized meal creation via a Unified Meal Engine Service.
- **Medical Personalization System**: Ensures safety with a Profile Resolution Service and Medical Badge Computation.
- **Concierge Systems**: Intelligent notification (Concierge Reminder Engine) and full voice command (Voice Concierge System).
- **Dual Input Copilot System**: Voice AND text command inputs both route through Phase B pipeline (CopilotCommandRegistry) with voice fallback banner ("Try typing instead") when Whisper mishears, auto-focus text input for accessibility, and unified black glass styling. Preserves all Phase B logic: Spotlight walkthroughs, hub-first routing, NL engine, suggestion telemetry.
- **Production-Ready ChatGPT System**: Advanced deterministic meal generation with Zod validation, allergen detection, and macro estimation.
- **Universal Dietary Override System**: Centralized component prioritizing Medical > Preference > Profile.
- **Access Control**: Feature access based on subscription tiers.
- **Authentication System**: LocalStorage-based email/password authentication with route protection.
- **Specialized Hubs**: "Clinical Recovery & Protocols Hub" for short-term diets and "Clinical Lifestyle Hub" for long-term therapeutic diets.
- **Stripe Integration**: Comprehensive checkout and subscription management.
- **Engagement Features**: Game Audio System, Ingredients Tetris, Macro Match Game.
- **PWA Configuration**: Progressive Web App setup for native app experience.
- **Railway Deployment Ready**: Configured for autoscale deployment with Docker.
- **Tutorial Hub**: Video tutorial system.
- **Wellness Hub**: Unified health navigation.
- **Permanent Meal Image Storage**: DALL-E images stored in Replit Object Storage with caching.
- **Meal Logging and Weight Tracking**: Restored meal logging APIs with compound cursor pagination and dual-write server-as-truth weight tracking.
- **Three-Tier Snack Architecture**: Complete isolation for Diabetic, GLP-1, and Anti-inflammatory snack systems with dedicated data files and zero cross-contamination.
- **Performance & Competition Builder Data**: Standalone competition-prep ingredient set (competitionIngredients.ts) and premade meals (competitionPremadeMeals.ts) following AthleteMeal interface for coaches/trainers prepping athletes for bodybuilding shows and sports performance.

# External Dependencies
- **Core Framework**: React 18, Vite, TypeScript
- **UI and Styling**: Radix UI, Tailwind CSS, Lucide React, shadcn/ui, Embla Carousel
- **Data Management**: TanStack React Query, Zod, Drizzle ORM
- **Database and Storage**: Neon Database, connect-pg-simple, @neondatabase/serverless
- **AI and Communication Services**: OpenAI (DALL-E 3, Whisper, GPT-4o), ElevenLabs, SendGrid, Twilio, BullMQ
- **Deployment**: Vercel (Frontend), Render (Backend)