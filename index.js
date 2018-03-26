const puppeteer = require('puppeteer');
const csv = require('fast-csv');
const fs = require('fs');

const listPage = process.env.LIST_PAGE || 'https://www.gooworld.jp/car/';

const writeCsv = (obj, filename) => {
  let ws = fs.createWriteStream(`./output/${filename}.csv`);
  csv.write(obj, { headers: true }).pipe(ws);
}

(async () => {
  const browser = await puppeteer.launch({
    // Debug mode
    headless: false,
    // Slow motion
    slowMo: 200
  });

  const page = await browser.newPage();

  await page.goto(listPage, { "waitUntil" : "networkidle0" });

  const brands = await page.evaluate(x => {
    let eles = Array.from(document.querySelectorAll(x));
    return eles.map(e => {
      return {
        name: e.textContent.trim(),
        url: e.childNodes[1].href
      }
    });
  }, '#contents span.textm');

  writeCsv(brands, '輸入車');
  
  await page.waitFor(5000);

  await browser.close();
})();