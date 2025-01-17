import {expect, test} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000) // another option override timeout

})

test('auto waiting', async ({page})=>{
    const successButton = page.locator('.bg-success')

    await successButton.click()

    // const text = await successButton.textContent()
    // await successButton.waitFor({state: 'attached'}) //helps wait
    // const text = await successButton.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}) //can override the timeout
})

test('alternative waits', async ({page})=>{
    const successButton = page.locator('.bg-success')

    //_wait for element
    // await page.waitForSelector('.bg-success')

    //__ wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata') //networking request to be successfully completed and then proceed

    //__ Wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle')


    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({page})=>{
    // test.setTimeout(10000) :- Can also OverRide like this! 
    test.slow()
    const successButton = page.locator('.bg-success')

    await successButton.click({timeout: 16000})

})