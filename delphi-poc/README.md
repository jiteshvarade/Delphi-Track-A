# Delphi Reader

A modern, elegant reading experience for long-form technical articles with AI-powered assistance and intelligent navigation.

## Overview

Delphi Reader transforms how you consume technical content by providing:
- **Smart Navigation**: Automatic table of contents with anchor links
- **AI Assistance**: Select text to explain, rephrase, or cite
- **Beautiful UI**: Dark mode support with premium typography
- **Activity Logging**: Track your reading and AI interactions

Built with React 19, Vite, TypeScript, and Tailwind CSS.

---

## Features

### 📖 Reading Trail Sidebar
- Automatically extracts headings (h2, h3) from articles
- Sticky sidebar that follows you while scrolling
- Adaptive layout: only appears for articles with 3+ headings
- Smooth scroll to any section with anchor navigation

### 🤖 AI-Powered Selection Actions
- **Explain**: Get simple explanations of complex terms
- **Rephrase**: Rewrite selected text for clarity
- **Cite**: Generate citation-ready references
- **Abortable Requests**: Cancel long-running AI operations
- Floating popup positioned near your text selection

### 🌙 Dark Mode
- System-aware theme detection
- Persistent preference via localStorage
- Smooth transitions between light and dark
- Optimized typography contrast in both modes

### 📝 Activity Logging
- Track all user actions and AI interactions
- Persistent logs across browser sessions
- Dedicated Logs page for reviewing history
- Timestamped entries for debugging

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks and context |
| **TypeScript** | Type safety and better DX |
| **Vite** | Lightning-fast dev server and build tool |
| **Tailwind CSS** | Utility-first styling framework |
| **@tailwindcss/typography** | Beautiful prose styling for articles |
| **React Router** | Client-side routing |
| **@floating-ui/react** | Positioning for selection popup |
| **Vitest** | Unit testing framework |
| **Playwright** | End-to-end testing |

---

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9 or higher (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd delphi-poc

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

## How to Run

### Development Mode

```bash
pnpm dev
```
- Hot Module Replacement (HMR) enabled
- Runs on http://localhost:5173
- Auto-reloads on file changes

### Production Build

```bash
pnpm build
```
- TypeScript compilation check
- Optimized Vite build with Rollup
- Output in `dist/` folder

### Preview Production Build

```bash
pnpm preview
```
- Serves the built files from `dist/`
- Test production build locally

### Linting

```bash
pnpm lint
```
- Runs ESLint on all source files
- Checks TypeScript and React best practices

---

## Testing

### Run Unit Tests

```bash
# Run all unit tests (watch mode)
pnpm test

# Or explicitly
pnpm test:unit
```
- Uses Vitest with jsdom environment
- Tests in `src/**/*.test.ts` files
- Excludes E2E tests automatically

### Run E2E Tests

```bash
# Run end-to-end tests (headless)
pnpm test:e2e

# Run with UI mode for debugging
pnpm test:e2e:ui
```
- Uses Playwright with Chromium
- Auto-starts Vite dev server
- Tests in `tests/e2e/**/*.spec.ts`

### Test Coverage

Unit tests cover:
- ✅ `useHeadings` hook logic (parsing, slugification)
- ✅ Component rendering and state management

E2E tests cover:
- ✅ Navigation flow (homepage → article page)
- ✅ Text selection and popup interaction

---

## Project Structure

```
delphi-poc/
├── public/              # Static assets
│   └── articles/        # Markdown article files
├── src/
│   ├── components/      # React components
│   │   ├── DarkModeToggle.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── ReadingTrail.tsx
│   │   ├── ScrollToTopButton.tsx
│   │   └── SelectionPopup.tsx
│   ├── context/         # React Context providers
│   │   └── LogContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useArticles.ts
│   │   └── useHeadings.ts
│   ├── pages/           # Route components
│   │   ├── ArticlePage.tsx
│   │   ├── HomePage.tsx
│   │   └── LogsPage.tsx
│   ├── utils/           # Utility functions
│   │   └── ai.ts
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles
├── tests/
│   └── e2e/             # Playwright E2E tests
│       └── app.spec.ts
├── ADR-001.md           # Architecture Decision: Tech Stack
├── ADR-002.md           # Architecture Decision: State Management
├── PRD.md               # Product Requirements Document
├── PROMPTS.md           # Development prompts used
├── playwright.config.ts # Playwright configuration
├── vitest.config.ts     # Vitest configuration
├── tailwind.config.ts   # Tailwind customization
└── package.json         # Dependencies and scripts
```

---

## Key Features Implementation

### Reading Trail
- **Hook**: `useHeadings(content)` parses HTML and extracts h2/h3 tags
- **Component**: `ReadingTrail` displays headings as sticky sidebar
- **Behavior**: Only shown when article has 3+ headings

### AI Selection Popup
- **Component**: `SelectionPopup` with Explain/Rephrase/Cite actions
- **Positioning**: Uses `@floating-ui/react` for smart placement
- **Abort Control**: `AbortController` pattern for cancellable requests
- **State**: Loading, result, and canceled states with transitions

### Dark Mode
- **Toggle**: `DarkModeToggle` component in header
- **Storage**: Preference saved to localStorage as `theme`
- **Classes**: Tailwind `dark:` variants throughout components
- **System**: Detects `prefers-color-scheme` on first load

### Activity Logs
- **Context**: `LogContext` provides global `addLog` function
- **Persistence**: Logs saved to localStorage as JSON array
- **Display**: `LogsPage` renders all logs with timestamps
- **Usage**: Called on navigation, AI actions, successes/failures

---

## Configuration

### Tailwind Theme

Custom theme in `tailwind.config.ts`:
- **Fonts**: Inter (sans), Lora (serif)
- **Colors**: Zinc palette for modern minimalist look
- **Typography**: Extended prose classes for articles
- **Dark Mode**: Class-based strategy

### Environment Variables

Currently no environment variables required. AI calls use a mock utility function.

To integrate a real AI backend:
1. Add API endpoint URL as `VITE_AI_API_URL`
2. Update `src/utils/ai.ts` with actual fetch logic
3. Handle authentication tokens if needed

---

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

---

## Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: ~150KB gzipped
- **Hot Module Replacement**: < 50ms

---

## Documentation

- **[PRD.md](./PRD.md)**: Product requirements and feature specs
- **[PROMPTS.md](./PROMPTS.md)**: Development prompts and patterns
- **[ADR-001.md](./ADR-001.md)**: Tech stack decision rationale
- **[ADR-002.md](./ADR-002.md)**: State management for logging

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Built with [Vite](https://vite.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Typography by [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- Icons from [Lucide React](https://lucide.dev/)
- Floating UI by [@floating-ui/react](https://floating-ui.com/)
