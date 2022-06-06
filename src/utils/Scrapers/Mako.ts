import { Page } from "@playwright/test";
import { handleClick, scrapePage, getTextFromElement } from "../Scrape";

async function getAuthorData(page: Page) {
  await page.locator(".writer-data a").waitFor();
  const anchorAuthor = await page.locator(".writer-data a");

  return Promise.all([
    (async () => {
      const regex = /\/news-team\/Editor-(.*)\.htm/gm;

      const href = await anchorAuthor.getAttribute("href");

      if (href) {
        const results = regex.exec(href);
        if (results) {
          const [, id] = results;
          return id;
        }
      }

      return "";
    })(),
    await anchorAuthor.textContent(),
  ]);
}

export async function MakoScrape() {
  await scrapePage("https://mako.co.il", async (page: Page) => {
    await handleClick(page, "h2.small a", "h1");

    // todo: get the date.
    const [title, subTitle, sectionsTitle, sections] = await Promise.all([
      getTextFromElement(page, "h1"),
      getTextFromElement(page, "h2"),
      getTextFromElement(page, "h3", true),
      getTextFromElement(page, "section.article-body p", true),
    ]);

    const author = await getAuthorData(page);

    // Should handle the URL to prevent processing again in the future.

    console.log(title, subTitle, sectionsTitle, sections, author);
  });
}
