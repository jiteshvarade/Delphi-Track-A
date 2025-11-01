# Prompt Appendix
## AI Prompts Used in Delphi Reader

**Document Version:** 1.0  
**Last Updated:** November 2024

---

## Overview

This document catalogs all AI prompts used in the Delphi Reader application, including both runtime prompts (sent to Gemini API) and template fallbacks (Model-OFF mode).

---

## 1. Selection Action Prompts (Model-ON)

### 1.1 Explain Action
**Purpose**: Simplify and clarify selected text for better understanding

```typescript
const prompt = `Explain the following text in simple terms:\n\n"${selectedText}"`
```

**Example Input**: "React adheres to the declarative programming paradigm."

**Expected Output**: Clear explanation breaking down the concept of declarative programming, using analogies and examples accessible to non-experts.

**Model Parameters**:
- Temperature: 0.7 (balanced creativity/accuracy)
- Max Tokens: 500
- Model: `gemini-2.5-flash-preview-05-20`

---

### 1.2 Rephrase Action
**Purpose**: Rewrite text for improved clarity and conciseness

```typescript
const prompt = `Rephrase the following text to be clearer and more concise:\n\n"${selectedText}"`
```

**Example Input**: "In order to make a decision about whether or not to use React..."

**Expected Output**: "To decide whether to use React..."

**Model Parameters**:
- Temperature: 0.7
- Max Tokens: 500
- Model: `gemini-2.5-flash-preview-05-20`

---

### 1.3 Cite Action
**Purpose**: Generate properly formatted academic citations

```typescript
const prompt = `Create a proper citation for the following text:\n\n"${selectedText}"`
```

**Example Input**: "React is a free and open-source front-end JavaScript library..."

**Expected Output**: APA, MLA, and Chicago style citations with placeholders for source metadata (author, date, URL, etc.)

**Model Parameters**:
- Temperature: 0.7
- Max Tokens: 500
- Model: `gemini-2.5-flash-preview-05-20`

---

## 2. Template Prompts (Model-OFF Mode)

### 2.1 Explain Template

**Purpose**: Provide useful reading strategies when AI is unavailable

**Template Structure**:
```markdown
## Understanding This Text

**Selected text:** "${text.substring(0, 100)}..."

**Analysis:**
- **Length:** ${wordCount} words (${complexity} passage)
- **Type:** ${detectTextType(text)}

**To understand this better:**
1. Break it down into smaller sentences
2. Look up unfamiliar terms
3. Identify the main idea and supporting points
4. Relate it to concepts you already know

**Key reading strategies:**
- Read slowly and carefully
- Take notes on main points
- Ask questions as you read
- Summarize in your own words

*Note: This is a template response. Enable AI mode for personalized explanations.*
```

**Text Type Detection Logic**:
- Code snippets: Contains `function`, `const`, `let`, `class`
- Academic text: Contains `therefore`, `however`, `moreover`
- Questions: Contains `?` followed by space
- Multi-paragraph: > 5 sentences

---

### 2.2 Rephrase Template

**Purpose**: Provide simplification guidelines when AI is unavailable

**Template Structure**:
```markdown
## Rephrased Version

**Original:**
> ${text}

**Simplified:**
> ${rephrased}

**Suggestions for further improvement:**
- Use active voice instead of passive
- Replace complex words with simpler alternatives
- Break long sentences into shorter ones
- Remove redundant phrases

**Common patterns to simplify:**
- "Due to the fact that" → "Because"
- "In order to" → "To"
- "At this point in time" → "Now"
- "Make a decision" → "Decide"

*Note: This is a basic simplification. Enable AI mode for advanced rephrasing.*
```

**Simplification Rules**:
1. Remove intensifiers: `very`, `really`, `quite`
2. Remove opinion phrases: `I think`, `I believe`, `In my opinion`
3. Normalize whitespace

---

### 2.3 Cite Template

**Purpose**: Provide citation format guidelines when AI is unavailable

**Template Structure**:
```markdown
## Citation Formats

**Selected Quote:**
> "${text.substring(0, 200)}..."

### APA Style (7th Edition)
Author, A. A. (Year). *Title of article*. Title of Periodical, volume(issue), pages. URL

**Example:**
\`\`\`
[Author]. (${currentYear}). [Article Title]. Retrieved ${formattedDate}, from [URL]
\`\`\`

### MLA Style (9th Edition)
Author Last Name, First Name. "Title of Article." Title of Website, Publisher, Date, URL.

**Example:**
\`\`\`
[Author]. "[Article Title]." [Website Name], ${formattedDate}, [URL].
\`\`\`

### Chicago Style (17th Edition)
Author Last Name, First Name. "Title of Article." Website Name. Date. URL.

**Example:**
\`\`\`
[Author]. "[Article Title]." [Website], ${formattedDate}. [URL].
\`\`\`

**Next steps:**
1. Fill in the placeholders with actual source information
2. Adjust format based on your citation style guide
3. Include page numbers if applicable
4. Verify URL access date

*Note: This is a template guide. Enable AI mode for auto-generated citations.*
```

---

## 3. Prompt Engineering Principles

### 3.1 Design Philosophy
1. **Clarity**: Unambiguous instructions
2. **Context**: Provide full selected text
3. **Constraints**: Set reasonable token limits
4. **Fallbacks**: Always have Model-OFF alternative

### 3.2 Best Practices
- ✅ Use explicit formatting instructions
- ✅ Include examples in templates
- ✅ Maintain consistent tone
- ✅ Provide actionable next steps
- ✅ Acknowledge limitations (template disclaimer)

### 3.3 Avoided Anti-Patterns
- ❌ Open-ended prompts without constraints
- ❌ Asking for creative outputs (we want factual)
- ❌ Multi-turn conversations (single-shot design)
- ❌ Assuming prior context (stateless requests)

---

## 4. Streaming Implementation

All prompts use **streaming responses** for better perceived performance:

```typescript
await aiService.streamCompletion(prompt, config, {
  onThinking: (message) => {
    // "Understanding your request..."
    // "Analyzing context..."
    // "Generating response..."
  },
  onToken: (token) => {
    // Receive word-by-word
    result += token
  },
  onComplete: (fullText, stats) => {
    // Final result + usage stats
  }
})
```

**Benefits**:
- Users see progress immediately
- Can cancel during generation
- Feels faster than waiting for complete response

---

## 5. Future Prompt Enhancements

### Planned Improvements (v2)
1. **Context-aware prompts**: Include article title/metadata
2. **User personalization**: Adapt based on reading level
3. **Multi-modal**: Support images, code blocks
4. **Summarization**: Condense long articles
5. **Question answering**: Interactive Q&A mode

### Advanced Techniques to Explore
- Few-shot learning: Provide examples in prompt
- Chain-of-thought: Request step-by-step reasoning
- Self-consistency: Generate multiple outputs, pick best
- Temperature tuning: Lower for factual, higher for creative

---

## Appendix: Token Usage

**Average Token Consumption** (Model-ON):
- Explain: ~300-400 tokens
- Rephrase: ~200-300 tokens
- Cite: ~150-250 tokens

**Cost**: $0.00 (Gemini free tier)

**Rate Limits**: 60 requests/minute (Gemini API default)
