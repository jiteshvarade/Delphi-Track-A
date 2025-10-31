# Development Prompts: Delphi Reader

This document captures the key prompts and requests used during the development of Delphi Reader.

---

## 1. Initial Setup & Configuration

### Tailwind CSS Configuration
```
Configure my Tailwind CSS with the Typography plugin.
Update my index.css to use modern premium theme colors (zinc palette).
Add Google Fonts: Inter (sans) and Lora (serif).
```

### Routing Setup
```
Create a React Router setup with three pages:
- HomePage: List all articles
- ArticlePage: Display full article with dynamic routing
- LogsPage: Show activity logs
```

---

## 2. Core Features Implementation

### Reading Trail Sidebar
```
Create a useHeadings.ts hook that parses HTML content and extracts h2 and h3 tags.
Create a ReadingTrail component that displays headings as a sticky sidebar.
Only show the sidebar when there are more than 2 headings.
Make the sidebar sticky with proper offset below the header.
```

### AI Selection Popup
```
Build a SelectionPopup component with Explain, Rephrase, and Cite buttons.
Use @floating-ui/react to position the popup near the selected text.
Implement abortable agent calls with AbortController.
Show loading spinner and Cancel button during AI requests.
Add smooth transitions and modern styling with Tailwind.
```

### Dark Mode Toggle
```
Create a DarkModeToggle component with sun/moon icons.
Store the preference in localStorage.
Support system preference detection.
Apply dark: classes throughout the app for proper contrast.
```

### Activity Logging
```
Create a LogContext with React Context API.
Implement addLog function and persist logs to localStorage.
Display logs on LogsPage with timestamps and action names.
Log all user interactions: navigation, AI calls, successes, failures.
```

---

## 3. UI/UX Refinements

### Header & Layout
```
Create a sticky Header component with the app title and dark mode toggle.
Wrap routes in a Layout component that includes Header and ScrollToTopButton.
Remove duplicate dark mode toggles from individual pages.
Ensure content never hides behind the sticky header by adding proper padding.
```

### Scroll Behavior & Spacing
```
Add scroll-margin to article headings so anchor navigation doesn't hide content behind the header.
Reduce bottom margin from mb-[100vh] to mb-20 to prevent excessive scrolling.
Make ReadingTrail sidebar sticky with top-8 offset for visual balance.
```

### Typography & Theme
```
Use prose classes from @tailwindcss/typography for article content.
Apply lg:prose-xl for better readability.
Add dark:prose-invert for automatic dark mode text styling.
Use Inter for UI and Lora for article body text.
```

---

## 4. Testing & Quality Assurance

### Unit Tests (Vitest)
```
Write 3 unit tests for useHeadings.ts hook:
1. Returns empty array for empty content
2. Correctly finds all h2 and h3 tags with proper levels
3. Creates slugified IDs (e.g., 'Notable features' -> 'notable-features')
```

### E2E Tests (Playwright)
```
Write 2 E2E tests:
1. Navigation: User clicks first article from homepage and sees the article title
2. Selection: User selects "Declarative" text and the SelectionPopup appears with action buttons

Use programmatic text selection and mouseup dispatch for reliable headless browser testing.
```

### Test Configuration
```
Create vitest.config.ts to exclude tests/e2e from unit test runs.
Create playwright.config.ts with auto-starting Vite dev server.
Add test scripts to package.json:
- test: vitest
- test:unit: vitest  
- test:e2e: playwright test
- test:e2e:ui: playwright test --ui
```

---

## 5. Debugging & Fixes

### Header Overlap Issues
```
Problem: Content and ReadingTrail hide behind sticky header.
Solution: Increase Layout pt-24, adjust ReadingTrail top-28, add scroll-mt-32 to headings.
Final fix: Remove sticky from header to simplify layout and avoid overlap entirely.
```

### Selection Popup Not Appearing in E2E
```
Problem: Double-click doesn't trigger selection popup in headless mode.
Solution: Use page.evaluate() to programmatically create Range, set Selection, 
and dispatch mouseup event on article element.
```

### Vitest Importing Playwright Tests
```
Problem: Vitest tries to import @playwright/test and fails.
Solution: Add exclude pattern in vitest.config.ts to skip tests/e2e folder.
```

---

## Key Patterns & Decisions

1. **Component Composition**: Small, focused components (Header, Layout, SelectionPopup)
2. **Custom Hooks**: Encapsulate logic (useHeadings, useArticles)
3. **Context API**: Share state without prop drilling (LogContext)
4. **Floating UI**: Reliable positioning for tooltips and popups
5. **AbortController**: Cancel long-running async operations gracefully
6. **localStorage**: Persist user preferences and activity logs
7. **Tailwind Utilities**: Rapid UI development with responsive design
8. **TypeScript**: Type safety for hooks, components, and context

---

## Retrospective Notes

### What Worked Well
- Incremental feature development with frequent testing
- Using modern tools (Vite, Tailwind, Floating UI)
- Test-driven approach for critical logic
- Clear separation of concerns (hooks, components, context)

### What Could Improve
- Earlier E2E test setup to catch UI regressions
- More comprehensive TypeScript types for article content
- Performance profiling for large articles
- Accessibility audit with automated tools

### Future Enhancements
- Keyboard shortcuts for navigation and AI actions
- User preferences panel (font size, reading width)
- Article search and filtering
- Export logs as JSON or CSV
- Real backend integration for AI calls
