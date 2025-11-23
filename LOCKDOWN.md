# 🔒 CODEBASE LOCKDOWN MANIFEST

## PURPOSE
This document establishes **absolute stability** for My Perfect Meals application. All features listed below are **LOCKED** and require explicit approval before any modifications.

---

## 🚨 LOCKDOWN RULES

### **MANDATORY APPROVAL WORKFLOW**
1. **Agent MUST ask for approval** before making ANY changes to locked features
2. **User explicitly approves** unlocking the specific feature
3. Agent makes changes only to approved features
4. Agent asks user to re-lock after changes complete
5. **NO EXCEPTIONS** - no random fixes, no surprise modifications, no side-effects

### **VIOLATION POLICY**
If a locked feature breaks unexpectedly, the agent has violated lockdown protocol. User will be informed immediately and rollback options will be provided.

---

## 🔐 LOCKED FEATURES (PRODUCTION-READY)

### **MEAL PLANNING FEATURES**
- ✅ Weekly Meal Board (all meal types: breakfast, lunch, dinner, snacks)
- ✅ Beach Body Meal Board (event prep lean-out system)
- ✅ Diabetic Hub (blood sugar management meal planning)
- ✅ GLP-1 Hub (medication-optimized meal planning)
- ✅ Fridge Rescue (AI meal generation from available ingredients)
- ✅ Premade Meals (breakfast, lunch, dinner, snacks - all dietary types)
- ✅ Builder Plan System (custom meal plan creation)

### **AI MEAL GENERATION**
- ✅ AI Meal Creator Modal (4-step creation process)
- ✅ Craving Creator (locked per user explicit demand - "don't touch it ever again")
- ✅ Macro Targeting System (custom macro controls)
- ✅ Medical Badge System (safety validation)
- ✅ Unified Meal Engine Service (backend AI orchestration)

### **TRACKING & ANALYTICS**
- ✅ Macro Calculator (daily macro tracking)
- ✅ Biometrics System (body stats, weight tracking)
- ✅ Meal Logging (breakfast, lunch, dinner, snacks)
- ✅ Food Logging (individual food items)
- ✅ Dual-Write Weight Tracking (server-as-truth system)

### **NAVIGATION & UI**
- ✅ Dashboard (extended, compact, mobile-optimized versions)
- ✅ Planner Hub (meal planning feature navigation)
- ✅ Wellness Hub (men's/women's health navigation)
- ✅ Router System (all routes and navigation)
- ✅ Glass Treatment Package (UI design system)

### **USER MANAGEMENT**
- ✅ Authentication System (LocalStorage-based accounts)
- ✅ Onboarding Flow (health data collection)
- ✅ Profile Management
- ✅ Feature Access Control (subscription tiers)

### **SHOPPING & MEAL PREP**
- ✅ Shopping List System
- ✅ Meal Plan Archive
- ✅ Recipe Management

### **HEALTH HUBS**
- ✅ Clinical Lifestyle Hub (therapeutic diets)
- ✅ Medical Diets Hub (surgical/recovery protocols)
- ✅ Hormone Optimization (life stages)

### **PAYMENT & SUBSCRIPTION**
- ✅ Stripe Integration (checkout, subscriptions, webhooks)
- ✅ Subscription Management

### **GAMIFICATION**
- ✅ Ingredients Tetris Game
- ✅ Macro Match Game
- ✅ Game Audio System

### **ADVANCED FEATURES**
- ✅ Voice Concierge System (voice commands, transcription)
- ✅ Reminder Engine (smart notifications)
- ✅ Tutorial Hub (video tutorials)
- ✅ PWA Configuration (home screen installation)

---

## 🧊 QUARANTINED FEATURES (OBSOLETE - DO NOT ACTIVATE)
Located in `/client/src/pages/_quarantine/`:
- Restaurant Guide
- Meal Finder
- Craving Hub (old version)
- Alcohol Hub

**RULE:** These features are permanently quarantined. Do not activate, modify, or reference.

---

## 🔮 FUTURE FEATURES (NOT YET LAUNCHED)
Located in `/client/src/pages/_future/`:
- Trainer Dashboard
- Client Management
- Doctor Portal
- Advanced Analytics

**RULE:** These features are locked for future launch. Do not activate until user explicitly requests.

---

## 🎯 ACTIVE DEVELOPMENT ZONE

### **CURRENTLY UNLOCKED FOR WORK:**
- Co-Pilot System (walkthrough flow improvements)

**RULE:** Only the Co-Pilot system is currently approved for modifications. All other features remain locked.

---

## 📋 CHANGE REQUEST PROCESS

### **How to Request Unlock:**
1. User identifies specific feature needing changes
2. User explicitly states: "Unlock [FEATURE NAME] for changes"
3. Agent confirms unlock and proceeds with modifications
4. Agent completes work and requests re-lock
5. User approves re-lock

### **Emergency Fixes:**
If a locked feature has a critical bug:
1. Agent identifies the issue and reports to user
2. Agent requests emergency unlock for that specific feature only
3. User approves emergency unlock
4. Agent fixes ONLY the reported issue
5. Agent requests re-lock immediately

---

## 🚀 DEPLOYMENT ZONES

### **ZONE 1: DEVELOPMENT (This Workspace)**
- Current Replit workspace
- All changes happen here first
- Full testing before deploying to staging

### **ZONE 2: STAGING (Beta Testing)**
- Separate deployment for beta testers
- Trainers, doctors, clients test here
- Real-world testing of features
- See DEPLOYMENT_GUIDE.md for setup

### **ZONE 3: PRODUCTION (Future - January 2025)**
- Public App Store release
- Only tested, stable code
- See DEPLOYMENT_GUIDE.md for workflow

---

## 📊 LOCKDOWN EFFECTIVENESS

### **PROTECTED AGAINST:**
- ✅ Random feature breakages
- ✅ Unintended side-effects from other work
- ✅ Agent "fixing" wrong files
- ✅ Schema mismatches from unauthorized changes
- ✅ UI regressions
- ✅ Feature overwrites

### **ALLOWS:**
- ✅ Explicit, controlled changes to specific features
- ✅ Emergency bug fixes with approval
- ✅ Focused development on approved features
- ✅ Clean git history
- ✅ Stable beta testing environment

---

## 🔥 LAST UPDATED
**Date:** November 23, 2025  
**Status:** Complete codebase lockdown active  
**Active Work:** Co-Pilot system improvements only

---

**Remember: Stability is the foundation of a successful launch. Every feature that's locked is a feature that won't break unexpectedly.**
