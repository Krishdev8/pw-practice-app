import {test, expect} from '@playwright/test'
import {NavigationPage} from '../page-objects/navigationPage'
import {FormLayoutPage} from '../page-objects/formLayoutsPage'
import { datePickerPage } from '../page-objects/datePickerPage'

test.beforeEach(async({page})=>{
    await page.goto('http://localhost:4200/')
})

test('navigate to form page', async({page})=>{
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()
    await navigateTo.datePickerPage()
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()
})

test('parametrized methods', async({page})=>{
    const navigateTo = new NavigationPage(page)
    const onFormLayoutsPage = new FormLayoutPage(page)

    const onDatePickerPage = new datePickerPage(page)

    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('krish@krishna.com','Balram1', 'Option 2')
    await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('Krishna', 'krish@krishna.com', false)

    await navigateTo.datePickerPage()
    await onDatePickerPage.selectCommeonDatePickerDateFromToday(10)

    await onDatePickerPage.selectDatePickerWithRangeFromToday(10, 20)
})