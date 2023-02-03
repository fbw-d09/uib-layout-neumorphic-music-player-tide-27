const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');
const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Flexbox', () => {
    it("Page should be styled with flexbox", async () => {
        const flexBox = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('display')));
        expect(flexBox.some(f => f === 'flex')).toBe(true);
    })
    
});

describe('Gradient and shadow', () => {
    it("Track Progress Bar should be styled with CSS 'linear-gradient' property", async () => {
        const stylesheet = fs.readFileSync(path.resolve('./style.css'), 'utf8');
        const linearGradient = stylesheet.match(/linear-gradient/g);
        expect(linearGradient).toBeTruthy();
    });
    it("Page should be styled with CSS 'box-shadow' property", async () => {
        const stylesheet = fs.readFileSync(path.resolve('./style.css'), 'utf8');
        const boxShadow = stylesheet.match(/box-shadow/g);
        expect(boxShadow).toBeTruthy();
    });
})

describe('Fonts and Icons', () => {
    it("Font awesome CDN should be loaded", async () => {
        const fontAwesomeCDN = await page.$eval('link[href*="fontawesome"]', (el) => el.href);
        expect(fontAwesomeCDN).toMatch(/fontawesome/);
    });
    it("Font awesome icons should be present on page", async () => {
        const fontAwesomeIcons = await page.$$eval('i[class*="fa"]', (els) => els.length);
        expect(fontAwesomeIcons).toBeGreaterThan(3);
    });
    it("Page should contain Google fonts 'Inter' font", async () => {
        const fonts = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('font-family')));
        expect(fonts.some(f => f.includes('Inter'))).toBe(true);
    });
    it("Page should be styled with different 'font-weights'", async () => {
        const fontWeights = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('font-weight')));
        expect(fontWeights.some(f => f === '400')).toBe(true);
        expect(fontWeights.some(f => f === '700')).toBe(true);
        expect(fontWeights.some(f => f === '800')).toBe(true);
    
    });
})