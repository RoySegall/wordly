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
}

export async function MakoScrape() {
  await scrapePage("https://mako.co.il", async (page: Page) => {
    const locator = await page.locator("h2.small a");

    await locator.first().click();
    await page.waitForLoadState();
    await page.locator("h1").waitFor();

    // todo: get the author and date.
    const [title, subTitle, sections] = await Promise.all([
      (await page.locator("h1")).textContent(),
      (await page.locator("h2")).textContent(),
      (async () => {
        const sections = await page.locator("section.article-body p");

        return await sections.evaluateAll((list) =>
          list.map((element) => element.textContent)
        );
      })(),
    ]);

    console.log(title, subTitle, sections);
  });
}
