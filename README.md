# Delphi Reader

A modern, elegant reading experience for long-form technical articles with AI-powered assistance and intelligent navigation.

## Overview

Delphi Reader transforms how you consume technical content by providing:
- **Smart Navigation**: Automatic table of contents with anchor links
- **AI Assistance**: Explain, rephrase, cite, and summarize with Google Gemini
- **Highlights & Notes**: Save important passages with color-coded highlights
- **Beautiful UI**: Vercel-inspired minimal design with dark mode
- **Activity Logging**: Track your reading and AI interactions
- **Engaging Animations**: Typewriter effects and smooth transitions

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
- **Summarize**: AI-generated article summaries with key points
- **Abortable Requests**: Cancel long-running AI operations
- Integrated popup with 4 action buttons
- Powered by Google Gemini 2.5 Flash

### 💾 Highlight & Save
- Select text and save as color-coded highlights (Yellow/Green/Blue/Pink)
- Add personal notes to your highlights
- Edit and delete highlights anytime
- LocalStorage persistence across sessions
- View all highlights in a dedicated panel
- Keyboard shortcut: Press **H** to highlight selected text

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

### 🎨 Modern UI/UX
- **Vercel-inspired Theme**: Clean black/white/gray minimal design
- **Typewriter Animation**: Engaging hero section with letter-by-letter text reveal
- **Responsive Header**: Dropdown navigation with article quick-access menu
- **Mobile-First**: Fully responsive design with hamburger menu
- **Smooth Animations**: Fade-in effects and micro-interactions
- **Sticky Navigation**: Always-accessible header

### 🏠 Enhanced Homepage
- Hero section with animated typewriter text
- Feature showcase with 6 key capabilities
- How It Works section (3-step guide)
- Statistics display (100% Free, 3 Actions, ∞ Offline)
- Quick access to all articles
- Clean call-to-action buttons

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
| **Marked** | Markdown parsing for AI responses |
| **Google Gemini** | AI text generation (2.5 Flash) |
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
│   │   ├── ArticleSummary.tsx          # AI article summarization
│   │   ├── DarkModeToggle.tsx
│   │   ├── Header.tsx                   # Navigation with dropdown
│   │   ├── HighlightsPanel.tsx         # Highlight management UI
│   │   ├── Layout.tsx
│   │   ├── MobileTableOfContents.tsx
│   │   ├── ReadingTrail.tsx
│   │   ├── ScrollToTopButton.tsx
│   │   ├── SelectionPopup.tsx          # AI actions popup
│   │   └── TypewriterText.tsx          # Animated text effect
│   ├── context/         # React Context providers
│   │   └── LogContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useArticles.ts
│   │   └── useHeadings.ts
│   ├── pages/           # Route components
│   │   ├── ArticlePage.tsx
│   │   ├── HomePage.tsx
│   │   └── LogsPage.tsx
│   ├── services/        # External services
│   │   └── aiService.ts                # Gemini AI integration
│   ├── utils/           # Utility functions
│   │   ├── highlightsStorage.ts        # LocalStorage for highlights
│   │   └── templateFallbacks.ts        # AI-off mode templates
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
- **Component**: `SelectionPopup` with Explain/Rephrase/Cite/Highlight actions
- **Service**: `aiService.ts` handles Gemini API streaming
- **Abort Control**: `AbortController` pattern for cancellable requests
- **State**: Loading, result, streaming, and canceled states
- **Mode**: Model ON (Gemini AI) or Model OFF (template fallbacks)

### Article Summary
- **Component**: `ArticleSummary` - collapsible AI summary generator
- **API**: Calls Gemini to generate 3-5 key bullet points
- **Caching**: Summary persists until page reload
- **UX**: Click header to expand/collapse summary

### Highlight & Save
- **Component**: `HighlightsPanel` - full-featured highlight manager
- **Storage**: `highlightsStorage.ts` - LocalStorage CRUD operations
- **Features**: 4 color options, personal notes, edit/delete
- **Access**: Click "Highlight" button in SelectionPopup or press **H** key
- **Persistence**: All highlights saved across browser sessions

### Typewriter Animation
- **Component**: `TypewriterText` - character-by-character reveal
- **Usage**: Homepage hero section with cascading animations
- **Timing**: 80ms per character, callbacks on completion
- **UX**: Smooth fade-in for subsequent content

### Responsive Navigation
- **Component**: `Header` with dropdown menu and mobile support
- **Desktop**: Hover over "Articles" shows dropdown with all articles
- **Mobile**: Hamburger menu with expandable article list
- **Sticky**: Header stays fixed at top during scroll

### Dark Mode
- **Toggle**: `DarkModeToggle` component in header
- **Storage**: Preference saved to localStorage as `theme`
- **Classes**: Tailwind `dark:` variants throughout components
- **Theme**: Vercel-inspired minimal black/white/gray palette

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
- **Colors**: Gray/Zinc palette for Vercel-inspired minimal look
- **Typography**: Extended prose classes for articles
- **Dark Mode**: Class-based strategy
- **Animations**: Custom fade-in keyframes for smooth transitions

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**To get a Gemini API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to `.env.local`
4. Restart the dev server

**Note**: The app works in "Model OFF" mode without an API key, using template-based responses.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **H** | Highlight selected text (opens highlight panel) |

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

## What's New 🎉

### Latest Updates (v2.0)

**🤖 Real AI Integration**
- Google Gemini 2.5 Flash integration
- Streaming responses with live updates
- Article summarization feature
- Model ON/OFF toggle for offline mode

**💾 Highlight & Save System**
- Color-coded highlights (4 colors)
- Personal notes on highlights
- LocalStorage persistence
- Edit and delete functionality

**🎨 UI/UX Improvements**
- Vercel-inspired minimal theme
- Typewriter animation on homepage
- Responsive navigation with article dropdown
- Smooth fade-in animations
- Mobile-first responsive design

**📝 Enhanced Features**
- Article summary generation
- Improved selection popup with 4 actions
- Keyboard shortcuts (H for highlight)
- Sticky header navigation
- Better dark mode support

---

## Acknowledgments

- Built with [Vite](https://vite.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Typography by [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Markdown rendering by [Marked](https://marked.js.org/)
