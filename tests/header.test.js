const puppeteer = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('adds two numbers', () => {
  const sum = 1 + 2;
  expect(sum).toEqual(3);
});

test('We can launch a browser', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});
