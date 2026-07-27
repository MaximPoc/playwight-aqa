/**
 * Opens the Registration modal from the landing page.
 * @param {import('@playwright/test').Page} page
 */
export async function openRegistrationForm(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.locator('app-signup-modal').waitFor({ state: 'visible' });
}

/**
 * @param {import('@playwright/test').Page} page
 */
export function registrationForm(page) {
  const modal = page.locator('app-signup-modal');

  return {
    modal,
    name: page.locator('#signupName'),
    lastName: page.locator('#signupLastName'),
    email: page.locator('#signupEmail'),
    password: page.locator('#signupPassword'),
    repeatPassword: page.locator('#signupRepeatPassword'),
    registerButton: modal.getByRole('button', { name: 'Register' }),
    fieldError: (field) =>
      field.locator('xpath=ancestor::div[contains(@class,"form-group")]').locator('.invalid-feedback'),
  };
}

/**
 * Fills registration fields. Pass only fields you want to set.
 * @param {import('@playwright/test').Page} page
 * @param {{
 *   name?: string,
 *   lastName?: string,
 *   email?: string,
 *   password?: string,
 *   repeatPassword?: string,
 * }} data
 */
export async function fillRegistrationForm(page, data) {
  const form = registrationForm(page);

  if (data.name !== undefined) await form.name.fill(data.name);
  if (data.lastName !== undefined) await form.lastName.fill(data.lastName);
  if (data.email !== undefined) await form.email.fill(data.email);
  if (data.password !== undefined) await form.password.fill(data.password);
  if (data.repeatPassword !== undefined) await form.repeatPassword.fill(data.repeatPassword);
}

/**
 * Triggers validation by focusing a field and then leaving it (blur).
 * @param {import('@playwright/test').Locator} field
 */
export async function triggerValidation(field) {
  await field.focus();
  await field.blur();
}

/**
 * Generates a unique email with the required aqa- prefix.
 * @param {string} [suffix]
 */
export function generateAqaEmail(suffix = Date.now().toString()) {
  return `aqa-${suffix}@test.com`;
}
