/*
  Imports Node's path module.

  We use this to create a reliable file path to the local HTML page.
*/
const path = require('path');

/*
  Imports Playwright's test and expect functions.

  test = defines a test case
  expect = checks that something happened correctly
*/
const { test, expect } = require('@playwright/test');

/*
  Creates the file path to the local login page.

  This allows Playwright to open app/index.html directly
  without needing a web server.
*/
const appPath = 'file://' + path.resolve(__dirname, '../app/index.html');

/*
  Runs before every test.

  Each test starts from a fresh copy of the login page.
*/
test.beforeEach(async ({ page }) => {
  await page.goto(appPath);
});

/*
  Test 1:
  Confirms the login page loads with the required fields.
*/
test('login page displays required fields', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'QA Login' })).toBeVisible();
  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

/*
  Test 2:
  Confirms a valid user can log in successfully.
*/
test('valid user can log in successfully', async ({ page }) => {
  await page.getByLabel('Username').fill('qa_user');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Welcome, QA Tester!')).toBeVisible();
});

/*
  Test 3:
  Confirms the app rejects an incorrect password.
*/
test('wrong password shows error and stays on login page', async ({ page }) => {
  await page.getByLabel('Username').fill('qa_user');
  await page.getByLabel('Password').fill('wrongPassword');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');
  await expect(page.getByRole('heading', { name: 'QA Login' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).not.toBeVisible();
});

/*
  Test 4:
  Confirms the app shows a validation message when fields are empty.
*/
test('empty fields show validation message', async ({ page }) => {
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText(
    'Username and password are required.'
  );

  await expect(page.getByRole('heading', { name: 'QA Login' })).toBeVisible();
});

/*
  Test 5:
  Confirms a locked account cannot log in.
*/
test('locked user cannot log in', async ({ page }) => {
  await page.getByLabel('Username').fill('locked_user');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText(
    'This account is locked. Contact an administrator.'
  );

  await expect(page.getByRole('heading', { name: 'Dashboard' })).not.toBeVisible();
});

/*
  Test 6:
  Confirms a logged-in user can log out and return to the login page.
*/
test('user can log out after successful login', async ({ page }) => {
  await page.getByLabel('Username').fill('qa_user');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page.getByRole('heading', { name: 'QA Login' })).toBeVisible();
  await expect(page.getByLabel('Username')).toHaveValue('');
  await expect(page.getByLabel('Password')).toHaveValue('');
});