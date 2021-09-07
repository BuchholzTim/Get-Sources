// Array of URLs to scrape
const urls = [
  "https://nodejs.org/en/",
  "https://v8.dev/",
];

const dirs = [
  './pdf',
  './html',
  './png',
]

const puppeteer = require("puppeteer");
const fs = require("fs");

// Create directories if they don't exist
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Begin scraping
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // CustomCounter corresponds to index which should be incremented and used as the prefix for the file name
  let customCounter = 1;

  for (const url of urls) {
    // Retrieve domain from URL
    const domain = url.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im
    )[1];

    await page.goto(url, { waitUntil: "networkidle2" });
    // Get as Image
    await page.screenshot({
      path: `./png/${customCounter}_${domain}.png`,
      fullPage: true,
    });
    // Get as PDF
    await page.pdf({
      path: `./pdf/${customCounter}_${domain}.pdf`,
      format: "a4",
    });
    // Get as HTML
    const content = await page.content();
    const fileName = `./html/${customCounter}_${domain}.html`;
    await fs.writeFile(fileName, content, function (err) {
      if (err) {
        return console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });

    customCounter++;
  }

  await browser.close();
})();
