import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Capture Login Page
    console.log('Navigating to Login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="email"]');
    await page.screenshot({ path: path.join(outputDir, '1_Login_Page.png') });
    console.log('Captured: 1_Login_Page.png');

    // 2. Capture Register Page
    console.log('Navigating to Register page...');
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="email"]');
    await page.screenshot({ path: path.join(outputDir, '2_Register_Page.png') });
    console.log('Captured: 2_Register_Page.png');

    // 3. Login as regular USER and capture Dashboard
    console.log('Logging in as user@example.com...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'user@example.com');
    await page.type('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');

    console.log('Waiting for Dashboard to load...');
    await page.waitForSelector('header');
    // Wait for API queries to settle
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.screenshot({ path: path.join(outputDir, '3_Dashboard_User_Role.png') });
    console.log('Captured: 3_Dashboard_User_Role.png');

    // 4. Logout and Login as ADMIN and capture Dashboard
    console.log('Logging out...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

    console.log('Logging in as admin@example.com...');
    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');

    console.log('Waiting for Admin Dashboard to load...');
    await page.waitForSelector('header');
    // Wait for API queries to settle
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.screenshot({ path: path.join(outputDir, '4_Dashboard_Admin_Role.png') });
    console.log('Captured: 4_Dashboard_Admin_Role.png');

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error during screenshot generation:', error);
  } finally {
    await browser.close();
  }
}

run();
