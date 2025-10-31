import { test, expect } from '@playwright/test'

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173'

// Helper to open first article from homepage
async function openFirstArticle(page: import('@playwright/test').Page) {
  await page.goto(BASE_URL + '/')
  const firstArticleLink = page.locator('a[href^="/article/"]').first()
  await expect(firstArticleLink).toBeVisible()
  await firstArticleLink.click()
}

test.describe('App E2E', () => {
  test('Navigation: open first article from homepage and title is visible', async ({ page }) => {
    await openFirstArticle(page)

    await expect(page).toHaveURL(/\/article\//)
    const title = page.locator('article h1').first()
    await expect(title).toBeVisible()
  })

  test('Selection: selecting "Declarative" shows the SelectionPopup', async ({ page }) => {
    await openFirstArticle(page)

    // Programmatically select the word "Declarative" and dispatch mouseup on the article
    await page.evaluate(() => {
      const article = document.querySelector('article') as HTMLElement | null
      if (!article) return
      const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT)
      let textNode: Text | null = null
      while (walker.nextNode()) {
        const n = walker.currentNode as Text
        if (n.nodeValue && n.nodeValue.includes('Declarative')) {
          textNode = n
          break
        }
      }
      if (!textNode) return
      const idx = textNode.nodeValue!.indexOf('Declarative')
      const range = document.createRange()
      range.setStart(textNode, idx)
      range.setEnd(textNode, idx + 'Declarative'.length)
      const sel = window.getSelection()!
      sel.removeAllRanges()
      sel.addRange(range)
      // Dispatch mouseup on the article to trigger the handler
      article.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    // The popup renders action buttons
    const explainBtn = page.getByRole('button', { name: 'Explain' })
    await expect(explainBtn).toBeVisible()
  })
})
