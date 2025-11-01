# Product Requirements Document (PRD)
## Delphi Reader - Track A: Reader UX + Copilot

**Version:** 1.0  
**Date:** November 2024  
**Author:** Front-End Developer Candidate

---

## Product Overview

Delphi Reader is an intelligent article reading platform that enhances comprehension through AI-powered text analysis and intuitive navigation features. It combines excellent typography with interactive tools to create an optimal reading experience.

## Core Features

### 1. Article Reading Interface
- **Typography Excellence**: Clean, readable design with proper font hierarchy and spacing
- **Responsive Layout**: Adapts seamlessly from mobile (375px) to desktop (1920px+)
- **Dark Mode**: Full support with appropriate contrast ratios
- **List View**: Card-based article browser with metadata (title, snippet, category)
- **Article View**: Full-content display with semantic HTML structure

### 2. Selection Actions (AI Copilot)
**Objective**: Provide contextual assistance for selected text

**Actions:**
- **Explain**: Simplify complex concepts with clear explanations
- **Rephrase**: Rewrite text for better clarity and conciseness
- **Cite**: Generate formatted citations (APA, MLA, Chicago)

**Technical Requirements:**
- **Abortable Requests**: Users can cancel in-flight AI requests via AbortController
- **Streaming Responses**: Token-by-token display for perceived performance
- **Model-OFF Mode**: Template-based fallbacks when AI is unavailable (graceful degradation)
- **Free Tier**: Google Gemini 2.5 Flash (no credit card required)

**UX Flow:**
1. User selects text → Popup appears
2. User clicks action (Explain/Rephrase/Cite)
3. Loading state with "thinking" indicators
4. Streaming response appears word-by-word
5. Complete state with usage stats

### 3. Reading Trail (Navigation Anchors)
**Objective**: Enable quick navigation through long articles

**Desktop (≥1024px):**
- Fixed sidebar with heading hierarchy (H2, H3)
- Scroll-aware highlighting of current section
- Smooth scroll to sections on click

**Mobile (<1024px):**
- Collapsed by default (space-efficient)
- Accessible via floating TOC button
- Drawer overlay with same functionality

**Features:**
- Auto-generates from article HTML structure
- Preserves reading context
- Visual progress indicators

---

## User Stories

**As a reader**, I want to...
1. Quickly understand complex passages → Use "Explain" action
2. Navigate long articles efficiently → Use Reading Trail
3. Work offline or without API → Use Model-OFF mode
4. Get help without losing context → Inline popup UX

**As a developer**, I want to...
1. Maintain code quality → Unit + E2E tests
2. Monitor performance → LCP, CLS, TTI budgets
3. Debug user actions → In-app log viewer at /logs

---

## Success Metrics

### Performance Budgets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTI (Time to Interactive)**: < 3.5s

### Functional Requirements
- ✅ All 3 Selection Actions working (Explain, Rephrase, Cite)
- ✅ Abortable AI requests (cancel button functional)
- ✅ Model-OFF mode provides value (templates, not errors)
- ✅ Reading Trail works on mobile + desktop
- ✅ Responsive design (mobile-first, desktop-enhanced)

### Quality Requirements
- ≥3 Unit Tests (utilities, data validation, logic)
- ≥2 E2E Tests (user flows, critical paths)
- Accessibility: Semantic HTML, ARIA labels, keyboard navigation
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## Technical Constraints

1. **No Backend**: All processing happens in-browser
2. **Free Tier Only**: Gemini API (no paid services)
3. **Bundle Size**: Minimize for fast load times
4. **State Management**: React hooks (no external libraries like Redux)
5. **Styling**: Tailwind CSS (utility-first approach)

---

## Out of Scope (v1)

- User accounts / authentication
- Saving articles / bookmarks
- Custom themes beyond dark/light
- Multi-language support
- Annotations / highlighting persistence
- Social sharing features

---

## Future Considerations (v2+)

- **Reading Analytics**: Track comprehension patterns
- **Progressive Enhancement**: Offline-first with service workers
- **Collaborative Reading**: Share annotations with others
- **Advanced AI**: Multi-turn conversations, summarization

---

## Appendix

**Target Audience**: Knowledge workers, students, researchers  
**Platform**: Web (desktop + mobile browsers)  
**Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS  
**AI Provider**: Google Gemini 2.5 Flash (free tier)
