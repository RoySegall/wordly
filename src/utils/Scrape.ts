import { chromium, Page } from "@playwright/test";

export async function scrapePage(url: string, handler: (page: Page) => void) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  try {
    await handler(page);
  } catch (e) {
    console.log(e);
  }

  await browser.close();

  // todo: should return the value - the URL, so we won't scrape again and the data.
}

/**
 * Handle click properly.
 *
 * @param page - The page object.
 * @param linkSelector - The selector of the link.
 * @param postNavigationSelector - The selector which we need to wait after the navigation.
 */
export async function handleClick(
  page: Page,
  linkSelector: string,
  postNavigationSelector: string
) {
  const locator = await page.locator(linkSelector);

  // todo: return the url.
  await locator.first().click();
  await page.waitForLoadState();
  await page.locator(postNavigationSelector).waitFor();
}

export async function getTextFromElement(
  page: Page,
  selector: string,
  isMultiple?: boolean
) {
  if (isMultiple) {
    const sections = await page.locator(selector);

    return await sections.evaluateAll((list) =>
      list.map((element) => element.textContent)
    );
  }

  const element = await page.locator(selector);
  return element.textContent();
}
