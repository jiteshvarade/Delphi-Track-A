import { test, expect } from '@playwright/test'

test.describe('Selection Popup E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    // Navigate to first article
    await page.click('article:first-child a')
    await page.waitForSelector('article')
  })

  test('should show selection popup when text is selected', async ({ page }) => {
    // Select some text in the article
    const articleText = page.locator('article p').first()
    
    // Triple-click to select paragraph
    await articleText.click({ clickCount: 3 })
    
    // Wait for selection popup to appear
    await page.waitForSelector('[data-selection-popup="true"]', { timeout: 2000 })
    
    // Verify popup is visible
    const popup = page.locator('[data-selection-popup="true"]')
    await expect(popup).toBeVisible()
    
    // Verify action buttons are present
    await expect(page.getByRole('button', { name: /Explain/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Rephrase/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Cite/i })).toBeVisible()
  })

  test('should handle Model ON/OFF toggle', async ({ page }) => {
    // Select text to show popup
    const articleText = page.locator('article p').first()
    await articleText.click({ clickCount: 3 })
    await page.waitForSelector('[data-selection-popup="true"]')
    
    // Find and verify Model toggle is present
    const toggleButton = page.getByRole('button', { name: /Toggle AI Model/i })
    await expect(toggleButton).toBeVisible()
    
    // Check initial state (should be ON by default)
    const headerText = await page.locator('[data-selection-popup="true"]').textContent()
    expect(headerText).toContain('Powered by Gemini AI')
    
    // Toggle Model OFF
    await toggleButton.click()
    await page.waitForTimeout(500)
    
    // Verify it switched to template mode
    const updatedHeaderText = await page.locator('[data-selection-popup="true"]').textContent()
    expect(updatedHeaderText).toContain('Template Mode')
  })

  test('should show template response when Model is OFF', async ({ page }) => {
    // Select text
    const articleText = page.locator('article p').first()
    await articleText.click({ clickCount: 3 })
    await page.waitForSelector('[data-selection-popup="true"]')
    
    // Toggle Model OFF
    await page.getByRole('button', { name: /Toggle AI Model/i }).click()
    await page.waitForTimeout(300)
    
    // Click Explain button
    await page.getByRole('button', { name: /Explain/i }).click()
    
    // Wait for response
    await page.waitForSelector('text=/Understanding This Text/i', { timeout: 3000 })
    
    // Verify template response is shown
    const responseText = await page.locator('[data-selection-popup="true"]').textContent()
    expect(responseText).toContain('Understanding This Text')
    expect(responseText).toContain('Template Response')
  })

  test('should close popup when clicking backdrop', async ({ page }) => {
    // Select text to show popup
    const articleText = page.locator('article p').first()
    await articleText.click({ clickCount: 3 })
    await page.waitForSelector('[data-selection-popup="true"]')
    
    // Verify popup is visible
    const popup = page.locator('[data-selection-popup="true"]')
    await expect(popup).toBeVisible()
    
    // Click backdrop (outside popup)
    await page.locator('.fixed.inset-0.bg-black').click({ position: { x: 10, y: 10 } })
    
    // Popup should be gone
    await expect(popup).not.toBeVisible()
  })

  test('should navigate through action buttons', async ({ page }) => {
    // Select text
    const articleText = page.locator('article p').first()
    await articleText.click({ clickCount: 3 })
    await page.waitForSelector('[data-selection-popup="true"]')
    
    // Test Explain button
    await page.getByRole('button', { name: /Explain/i }).click()
    await page.waitForSelector('text=/Processing|Understanding/i', { timeout: 1000 })
    
    // Wait a bit for response
    await page.waitForTimeout(1500)
    
    // Click Rephrase
    await page.getByRole('button', { name: /Rephrase/i }).click()
    await page.waitForTimeout(500)
    
    // Verify active button styling changes
    const rephraseButton = page.getByRole('button', { name: /Rephrase/i })
    const buttonClasses = await rephraseButton.getAttribute('class')
    expect(buttonClasses).toContain('bg-indigo-600')
  })
})
