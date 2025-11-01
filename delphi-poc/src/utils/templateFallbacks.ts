/**
 * Template-based fallbacks for Model-OFF mode
 * Provides static but useful responses when AI is unavailable
 */

export interface TemplateFallback {
  content: string
  metadata: {
    isTemplate: true
    action: string
    timestamp: number
  }
}

/**
 * Generate template-based explanation
 */
export function generateTemplateExplanation(text: string): TemplateFallback {
  const wordCount = text.split(/\s+/).length
  const complexity = wordCount > 50 ? 'complex' : wordCount > 20 ? 'moderate' : 'simple'
  
  return {
    content: `## Understanding This Text

**Selected text:** "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"

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

*Note: This is a template response. Enable AI mode for personalized explanations.*`,
    metadata: {
      isTemplate: true,
      action: 'explain',
      timestamp: Date.now()
    }
  }
}

/**
 * Generate template-based rephrase
 */
export function generateTemplateRephrase(text: string): TemplateFallback {
  // Simple rephrasing rules
  const rephrased = text
    .replace(/\b(very|really|quite)\s+/gi, '') // Remove intensifiers
    .replace(/\b(I think|I believe|In my opinion)\s+/gi, '') // Remove opinion phrases
    .replace(/\s+/g, ' ')
    .trim()
  
  return {
    content: `## Rephrased Version

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

*Note: This is a basic simplification. Enable AI mode for advanced rephrasing.*`,
    metadata: {
      isTemplate: true,
      action: 'rephrase',
      timestamp: Date.now()
    }
  }
}

/**
 * Generate template-based citation
 */
export function generateTemplateCitation(text: string): TemplateFallback {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return {
    content: `## Citation Formats

**Selected Quote:**
> "${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"

### APA Style (7th Edition)
Author, A. A. (Year). *Title of article*. Title of Periodical, volume(issue), pages. URL

**Example:**
\`\`\`
[Author]. (${today.getFullYear()}). [Article Title]. Retrieved ${formattedDate}, from [URL]
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

*Note: This is a template guide. Enable AI mode for auto-generated citations.*`,
    metadata: {
      isTemplate: true,
      action: 'cite',
      timestamp: Date.now()
    }
  }
}

/**
 * Detect text type for better template responses
 */
function detectTextType(text: string): string {
  const lowerText = text.toLowerCase()
  
  if (lowerText.match(/\b(function|const|let|var|class|import)\b/)) {
    return 'Code snippet'
  }
  if (lowerText.match(/\b(therefore|thus|however|moreover)\b/)) {
    return 'Academic/formal text'
  }
  if (lowerText.match(/\?\s/)) {
    return 'Question or dialogue'
  }
  if (text.split(/[.!?]/).length > 5) {
    return 'Multi-paragraph text'
  }
  
  return 'General text'
}
