# ADR-001: Model-OFF Mode with Template Fallbacks

**Date:** 2024-11-01  
**Status:** Accepted  
**Deciders:** Development Team

---

## Context

Delphi Reader relies on the Gemini API for AI-powered text analysis features (Explain, Rephrase, Cite). However, several scenarios make API unavailability problematic:

1. **No API Key**: Users without configuration
2. **Network Failures**: Offline or poor connectivity
3. **Rate Limiting**: Exceeding free tier quotas
4. **Service Outages**: Gemini API downtime
5. **Demos/Presentations**: Need reliability without dependencies

**Requirement from Track A**: *"Model-OFF mode must still be useful"*

## Decision

We will implement a **dual-mode architecture**:

### Mode 1: Model-ON (Default)
- Real Gemini API streaming
- Personalized, context-aware responses
- Token tracking and usage stats

### Mode 2: Model-OFF (Fallback)
- Template-based static responses
- Educational content (reading strategies, format examples)
- No external dependencies
- Instant response (simulated 800ms delay for UX consistency)

**Key Implementation Details**:

```typescript
if (!modelEnabled) {
  // Use template fallbacks
  const template = action === 'explain' 
    ? generateTemplateExplanation(text)
    : action === 'rephrase'
    ? generateTemplateRephrase(text)
    : generateTemplateCitation(text)
  
  return template.content
}
```

**User Control**: Toggle switch in UI (persists via localStorage)

---

## Considered Alternatives

### Alternative 1: Error Messages Only
**Approach**: Show "AI unavailable, please configure API key" error

**Pros**:
- Simple implementation
- Clear about limitations

**Cons**:
- ❌ Not "useful" as required
- ❌ Dead-end UX (user can't proceed)
- ❌ Fails evaluation criteria

### Alternative 2: Cached Responses
**Approach**: Pre-generate responses for common text patterns

**Pros**:
- Fast, no API needed
- Could feel personalized

**Cons**:
- ❌ Requires large cache storage
- ❌ Only works for seen text
- ❌ Complex cache invalidation

### Alternative 3: Lightweight Local Model
**Approach**: Run small LLM in-browser (e.g., TensorFlow.js)

**Pros**:
- Truly personalized
- Works offline

**Cons**:
- ❌ Large bundle size (50MB+)
- ❌ Slow inference on low-end devices
- ❌ Complex setup

---

## Consequences

### Positive

✅ **Graceful Degradation**: App remains functional without API  
✅ **Educational Value**: Templates provide learning scaffolding  
✅ **Demo-Friendly**: Works in presentations without connectivity  
✅ **Cost Control**: Users can avoid API usage  
✅ **Fast Fallback**: Instant response (no network wait)

### Negative

⚠️ **Maintenance Burden**: Two codepaths to maintain  
⚠️ **Generic Content**: Templates can't be personalized  
⚠️ **UX Confusion**: Users might not understand difference

### Mitigation Strategies

1. **Clear Visual Indicators**: 
   - Model ON: "Powered by Gemini AI • Free"
   - Model OFF: "Template Mode • No API"
   
2. **Consistent UX**: Same popup, buttons, flow

3. **Template Quality**: Provide genuinely useful content (reading strategies, citation formats, simplification rules)

4. **Persistent State**: Remember user preference in localStorage

---

## Implementation

### File Structure
```
src/
  utils/
    templateFallbacks.ts       # Template generation logic
  services/
    aiService.ts                # Dual-mode handler
  components/
    SelectionPopup.tsx          # UI toggle + mode display
```

### Template Design Principles

1. **Structured**: Use headings, lists, examples
2. **Actionable**: Provide next steps
3. **Educational**: Teach concepts, not just answers
4. **Honest**: Acknowledge limitations ("Enable AI for personalized...")

### Example Template (Explain):
```markdown
## Understanding This Text

**Analysis:**
- Length: 45 words (moderate passage)
- Type: Academic/formal text

**Key reading strategies:**
1. Break it down into smaller sentences
2. Look up unfamiliar terms
3. Identify main idea
4. Relate to known concepts

*Note: Template response. Enable AI for personalization.*
```

---

## Metrics

### Success Criteria
- ✅ Model-OFF provides value (not just errors)
- ✅ Users can complete tasks without API
- ✅ Clear indication of current mode
- ✅ Toggle persists across sessions

### Future Enhancements
- **Smart Templates**: Analyze text complexity, adjust template
- **Partial Online**: Hybrid mode (local processing + API enhancement)
- **A/B Testing**: Measure template effectiveness vs. AI

---

## References

- Track A Requirements: "Model-OFF mode must still be useful"
- Nielsen Norman Group: Graceful Degradation patterns
- Progressive Enhancement principles
- User testing feedback (internal)

---

## Revision History

| Date       | Version | Changes                    |
|------------|---------|----------------------------|
| 2024-11-01 | 1.0     | Initial decision record    |
