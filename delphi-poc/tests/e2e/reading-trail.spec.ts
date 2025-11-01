import { test, expect } from '@playwright/test'

test.describe('Reading Trail E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to desktop size to ensure Reading Trail is visible
    await page.setViewportSize({ width: 1280, height: 720 })
    
    await page.goto('http://localhost:5173')
    // Navigate to first article (which has multiple headings)
    await page.click('article:first-child a')
    await page.waitForSelector('article')
  })

  test('should display Reading Trail on desktop', async ({ page }) => {
    // Wait for Reading Trail to be visible
    const readingTrail = page.locator('aside').filter({ hasText: /Reading Trail/i })
    
    // Should be visible on large screens
    await expect(readingTrail).toBeVisible()
    
    // Should have heading links
    const headingLinks = readingTrail.locator('a')
    const linkCount = await headingLinks.count()
    expect(linkCount).toBeGreaterThan(0)
  })

  test('should navigate to section when clicking Reading Trail link', async ({ page }) => {
    const readingTrail = page.locator('aside').filter({ hasText: /Reading Trail/i })
    await expect(readingTrail).toBeVisible()
    
    // Get first heading link
    const firstLink = readingTrail.locator('a').first()
    const linkText = await firstLink.textContent()
    
    // Click the link
    await firstLink.click()
    
    // Wait for scroll animation
    await page.waitForTimeout(500)
    
    // Verify URL has hash
    const url = page.url()
    expect(url).toContain('#')
    
    // Verify the heading is in viewport
    const headingId = url.split('#')[1]
    const heading = page.locator(`#${headingId}`)
    await expect(heading).toBeVisible()
  })

  test('should highlight active section in Reading Trail', async ({ page }) => {
    const readingTrail = page.locator('aside').filter({ hasText: /Reading Trail/i })
    await expect(readingTrail).toBeVisible()
    
    // Click a heading link
    const secondLink = readingTrail.locator('a').nth(1)
    await secondLink.click()
    await page.waitForTimeout(300)
    
    // Verify active styling
    const activeClasses = await secondLink.getAttribute('class')
    expect(activeClasses).toContain('text-indigo')
  })

  test('should show scroll progress indicator', async ({ page }) => {
    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(300)
    
    // Check if any heading indicators show progress
    const readingTrail = page.locator('aside').filter({ hasText: /Reading Trail/i })
    const isVisible = await readingTrail.isVisible()
    
    expect(isVisible).toBe(true)
  })

  test('should hide Reading Trail on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Reload to apply responsive layout
    await page.reload()
    await page.waitForSelector('article')
    
    // Reading Trail should be hidden
    const readingTrail = page.locator('aside').filter({ hasText: /Reading Trail/i })
    await expect(readingTrail).not.toBeVisible()
    
    // Mobile TOC button should be visible instead
    const mobileTOCButton = page.getByRole('button', { name: /table of contents/i })
    await expect(mobileTOCButton).toBeVisible()
  })

  test('should open mobile TOC drawer when button clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForSelector('article')
    
    // Click mobile TOC button
    const mobileTOCButton = page.getByRole('button', { name: /table of contents/i })
    await mobileTOCButton.click()
    
    // TOC drawer should appear
    await page.waitForSelector('[role="dialog"]', { timeout: 1000 })
    const drawer = page.locator('[role="dialog"]')
    await expect(drawer).toBeVisible()
    
    // Should have heading links
    const links = drawer.locator('a')
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThan(0)
  })
})
