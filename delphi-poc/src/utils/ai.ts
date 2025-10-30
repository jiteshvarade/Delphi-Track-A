interface CallAgentOptions {
  signal?: AbortSignal
}

export async function callAgent(options: CallAgentOptions = {}): Promise<string> {
  const { signal } = options

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

    // Return fake AI response
    return "This is an explanation."
    
  } catch (error) {
    // Re-throw abort errors so the component knows it was canceled
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    // Re-throw other errors
    throw error
  }
}
