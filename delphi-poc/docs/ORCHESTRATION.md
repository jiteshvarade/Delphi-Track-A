# System Orchestration: Delphi Reader

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐      ┌──────────────┐     ┌──────────────┐  │
│  │   HomePage    │─────▶│ ArticlePage  │────▶│ LogViewer    │  │
│  │  (List View)  │      │ (Read View)  │     │  (/logs)     │  │
│  └───────────────┘      └──────────────┘     └──────────────┘  │
│         │                       │                                │
│         │                       │                                │
│         ▼                       ▼                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              React Router (Client-side)                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Component Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐    ┌───────────────────┐                 │
│  │ SelectionPopup   │◀───│ Text Selection    │                 │
│  │ (AI Actions)     │    │ Handler           │                 │
│  └────────┬─────────┘    └───────────────────┘                 │
│           │                                                      │
│           │              ┌───────────────────┐                  │
│           │              │ ReadingTrail      │                  │
│           │              │ (Desktop: Sidebar)│                  │
│           │              │ (Mobile: Drawer)  │                  │
│           │              └───────────────────┘                  │
│           │                                                      │
│           │              ┌───────────────────┐                  │
│           │              │ MobileTableOfContents              │                  │
│           │              └───────────────────┘                  │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Services Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    aiService.ts                           │  │
│  │  ┌─────────────────┐         ┌────────────────────────┐  │  │
│  │  │   Model ON?     │─ Yes ──▶│  streamCompletion()    │  │  │
│  │  │   (Toggle)      │         │  - Gemini API          │  │  │
│  │  │                 │         │  - Streaming response  │  │  │
│  │  │                 │         │  - AbortController     │  │  │
│  │  └────────┬────────┘         └────────────────────────┘  │  │
│  │           │                                               │  │
│  │           │ No                                            │  │
│  │           ▼                                               │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │      templateFallbacks.ts                       │    │  │
│  │  │  - generateTemplateExplanation()                │    │  │
│  │  │  - generateTemplateRephrase()                   │    │  │
│  │  │  - generateTemplateCitation()                   │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────┐             │
│  │   Gemini API (Google)                          │             │
│  │   - Endpoint: generativelanguage.googleapis.com│             │
│  │   - Model: gemini-2.5-flash-preview-05-20     │             │
│  │   - Method: POST /generateContent              │             │
│  │   - Auth: API Key (query param)                │             │
│  │   - Response: JSON (full text, not SSE)        │             │
│  └────────────────────────────────────────────────┘             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Selection Action (Model-ON)

```
1. User selects text in article
   └─▶ ArticlePage.handleMouseUp()
       └─▶ window.getSelection()
           └─▶ setSelectionRange(range)
               └─▶ setSelectedText(text)

2. SelectionPopup renders
   └─▶ Shows: [Explain] [Rephrase] [Cite] buttons
   └─▶ Model toggle: [ON]

3. User clicks "Explain"
   └─▶ handleAction('explain')
       ├─▶ Check modelEnabled (true)
       ├─▶ Build prompt: "Explain the following text..."
       ├─▶ Create AbortController
       └─▶ aiService.streamCompletion(prompt, config, callbacks, signal)

4. aiService makes API call
   └─▶ fetch(GEMINI_API_URL, {
         method: 'POST',
         body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
         signal  ← AbortController.signal
       })

5. Response handling
   ├─▶ callbacks.onThinking('Understanding your request...')
   │   └─▶ UI shows: [Spinner] "Understanding your request..."
   │
   ├─▶ Receive full JSON response from Gemini
   │   └─▶ Extract: data.candidates[0].content.parts[0].text
   │
   ├─▶ Simulate streaming (word-by-word)
   │   └─▶ for each word:
   │       ├─▶ Check signal.aborted (abort if canceled)
   │       ├─▶ callbacks.onToken(word)
   │       │   └─▶ UI updates: result += word
   │       └─▶ await delay(20ms)
   │
   └─▶ callbacks.onComplete(fullText, stats)
       └─▶ UI shows: ✓ Complete | 156 tokens | FREE | 2.3s

6. User can abort anytime
   └─▶ Click [× Cancel] button
       └─▶ controller.abort()
           └─▶ fetch throws AbortError
               └─▶ Clear result, show "Action Canceled"
```

---

## Data Flow: Selection Action (Model-OFF)

```
1. User toggles Model OFF
   └─▶ setModelEnabled(false)
       └─▶ localStorage.setItem('modelEnabled', 'false')
           └─▶ UI updates: "Template Mode • No API"

2. User selects text & clicks "Explain"
   └─▶ handleAction('explain')
       ├─▶ Check modelEnabled (false)
       └─▶ Generate template fallback

3. Template generation (synchronous)
   └─▶ generateTemplateExplanation(selectedText)
       ├─▶ Analyze: word count, detect text type
       ├─▶ Build markdown template:
       │   "## Understanding This Text"
       │   "**Analysis:** 45 words (moderate passage)"
       │   "**Key reading strategies:** ..."
       └─▶ Return: { content, metadata: { isTemplate: true } }

4. UI update (simulated delay for consistency)
   └─▶ await delay(800ms)
       └─▶ setResult(template.content)
           └─▶ UI shows: ⚠️ Template Response | 0 tokens | 0.8s
```

---

## State Management

### Component State (React Hooks)

**ArticlePage**:
```typescript
- selectionRange: Range | null
- selectedText: string
```

**SelectionPopup**:
```typescript
- loading: boolean
- result: string
- streaming: boolean
- canceled: boolean
- controller: AbortController | null
- activeAction: string | null
- usageStats: UsageStats | null
- thinkingMessage: string
- modelEnabled: boolean  ← Persisted to localStorage
```

**LogContext** (Global):
```typescript
- logs: LogEntry[]
- addLog(message, level)
```

### Data Flow

```
Browser localStorage
    ↕
modelEnabled state
    ↓
aiService.streamCompletion() decision
    ↓
Either: Gemini API OR templateFallbacks
    ↓
Callbacks update UI state
    ↓
React re-renders component
```

---

## Error Handling Strategy

```
┌─────────────────────┐
│   User Action       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Try AI Request     │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
Network Error  AbortError
    │             │
    │             └─▶ Expected (user canceled)
    │                 └─▶ Show "Action Canceled"
    │
    └─▶ Check error type
        ├─▶ 404: "API endpoint not found"
        ├─▶ 401: "Invalid API key"
        ├─▶ 429: "Rate limit exceeded"
        └─▶ Other: "Gemini error: {message}"
```

---

## Performance Optimization

### Code Splitting
```
/                    → HomePage (eager)
/article/:id         → ArticlePage (eager)
/logs                → LogViewer (lazy)
SelectionPopup       → Lazy when first text selected
```

### Bundle Strategy
```
main.js              → Core React + Router (120KB gzip)
SelectionPopup.js    → AI components + marked.js (45KB gzip)
aiService.js         → No external deps (8KB gzip)
```

### Caching Strategy
```
- Static assets: Cache-Control: max-age=31536000
- HTML: Cache-Control: no-cache
- API responses: Not cached (dynamic)
- localStorage: modelEnabled preference
```

---

## Testing Strategy

### Unit Tests (Vitest)
```
src/utils/templateFallbacks.test.ts
├─▶ Template generation logic
├─▶ Text type detection
├─▶ Simplification rules
└─▶ Citation format generation

src/utils/headingUtils.test.ts
├─▶ Slugify function
└─▶ Text selection utilities

src/data/articles.test.ts
├─▶ Data validation
├─▶ ID uniqueness
└─▶ HTML structure checks
```

### E2E Tests (Playwright)
```
tests/e2e/selection-popup.spec.ts
├─▶ Text selection → popup appears
├─▶ Model ON/OFF toggle
├─▶ Template response (Model OFF)
├─▶ Cancel button functionality
└─▶ Action button navigation

tests/e2e/reading-trail.spec.ts
├─▶ Desktop sidebar visibility
├─▶ Navigation via headings
├─▶ Active section highlighting
├─▶ Mobile TOC drawer
└─▶ Responsive behavior
```

---

## Deployment Architecture

```
GitHub Repo
    │
    ├─▶ CI/CD (GitHub Actions)
    │   ├─▶ Run unit tests
    │   ├─▶ Run E2E tests
    │   ├─▶ Build production bundle
    │   └─▶ Deploy to Netlify
    │
    └─▶ Netlify
        ├─▶ Build: pnpm build
        ├─▶ Publish: dist/
        ├─▶ Redirects: /* → /index.html (SPA)
        └─▶ Environment: VITE_GEMINI_API_KEY (secret)
```

---

## Security Considerations

1. **API Key Protection**:
   - Stored in `.env.local` (gitignored)
   - Passed via client-side fetch (acceptable for free tier)
   - Rate-limited by Gemini (60 req/min)

2. **Content Security**:
   - No eval() usage
   - Sanitized markdown rendering (marked.js)
   - No localStorage sensitive data (only boolean flag)

3. **XSS Prevention**:
   - React escapes by default
   - `dangerouslySetInnerHTML` only for markdown (trusted source)

---

## Monitoring & Logging

**In-App Logger** (`/logs`):
```
[2024-11-01 20:15:32] INFO  User triggered Explain on: "React is..."
[2024-11-01 20:15:33] SUCCESS Explain action completed (156 tokens, $0.0000)
[2024-11-01 20:16:45] INFO  User canceled AI action
[2024-11-01 20:17:10] INFO  Explain action using template fallback (Model OFF)
```

**Performance Monitoring**:
- Lighthouse CI in GitHub Actions
- Budgets: LCP < 2.5s, CLS < 0.1, TTI < 3.5s
- Bundle size tracking

---

## Future Enhancements

1. **Offline Support**: Service worker + IndexedDB cache
2. **Multi-turn Conversations**: Chat-like interface
3. **Reading Analytics**: Track comprehension patterns
4. **Collaborative Reading**: Share annotations
5. **Advanced AI**: Summarization, Q&A mode
