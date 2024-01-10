import {expect, test} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({page}) => {
    //byTagName
    await page.locator('input').first().click()

    //byID (use a # in front of the ID)
    await page.locator('#inputEmail1').first().fill('a@g.com')

    //byclass value( put a "." in front of value for defining it's a class)

    page.locator('.shape-rectangle')

    //by attribute ( Use braces for placeholder)
    page.locator('[placeholder="Email"]')

    //by CLass value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors (No spaces required)
    page.locator('input[placeholder="Email"][nbinput]')  //Will find match for all three attributes

    //elements by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

test ('User facing locators', async ({page})=>{
    // there are various available roles in the Role Argument can check the Docs for details.
    await page.getByRole('textbox',{name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email' ).first().click()

    await page.getByLabel('Email' ).first().fill('amitgarg.cse@gmail.com')

    await page.getByPlaceholder('Jane Doe').first().click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()                     //Its a way by using

    await page.getByTitle('IoT Dashboard').click()
})
//DO NOT USE AfterEach and AfterAll in your code as it is not a good practice to use it.

test('locating child elements', async({page})=>{
    //for more compact syntax use this method
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()

    //alternative chaining the locators one-by-one
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    // #NOTE: We can combine both locator and getByRole methods to get the desired result
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    // can search using the index but try to avoid it as the sequence might be different in certain pages. Without using index or order of the elements is the best practice.
    await page.locator('nb-card').nth(3).getByRole('button').click()
})


test('locating parent elements', async({page})=>{
    await page.locator('nb-card',{hasText: "Using the Grid"}).getByRole('textbox',{name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox',{name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox',{name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox',{name: "password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
    .getByRole('textbox',{name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox',{name: "Email"}).click()

})

test('Reusing the locators', async({page})=>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox',{name: "Email"})


    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox',{name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    //First Assertion
    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values', async({page})=>{
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text Values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox',{name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

})

test('assertions', async({page})=>{
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    // General Assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    //Locator Assertions
    await expect(basicFormButton).toHaveText('Submit')

    //Soft Assertions
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})

