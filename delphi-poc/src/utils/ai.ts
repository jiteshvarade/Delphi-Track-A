interface CallAgentOptions {
  signal?: AbortSignal
  action?: string
}

const actionResponses: Record<string, string> = {
  explain: "This is an explanation of the selected text. It provides detailed context and clarification.",
  rephrase: "This is a rephrase of the selected text. The meaning is preserved but expressed differently.",
  cite: "This is a citation for the selected text. [Author, Year]. Available at: https://example.com"
}

export async function callAgent(options: CallAgentOptions = {}): Promise<string> {
  const { signal, action = 'explain' } = options

  try {
    // Create a 3-second delay promise
    const delayPromise = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000)
    })

    // Create an abort promise that rejects if signal is aborted
    const abortPromise = new Promise<never>((_, reject) => {
      if (signal) {
        signal.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'))
        })
      }
    })

    // Fetch with the abort signal
    const fetchPromise = fetch('https://jsonplaceholder.typicode.com/todos/1', {
      signal,
    })

    // Wait for both the delay and the fetch to complete, or abort if signal is triggered
    await Promise.race([
      Promise.all([delayPromise, fetchPromise]),
      abortPromise,
    ])

    // Return fake AI response based on action
    return actionResponses[action.toLowerCase()] || actionResponses.explain
    
  } catch (error) {
    // Re-throw abort errors so the component knows it was canceled
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    // Re-throw other errors
    throw error
  }
}
