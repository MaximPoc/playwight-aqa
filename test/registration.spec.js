// @ts-check
import { test, expect } from '@playwright/test';
import {
  openRegistrationForm,
  registrationForm,
  fillRegistrationForm,
  triggerValidation,
  generateAqaEmail,
} from './helpers/registration.helper.js';

const VALID_PASSWORD = 'Qwerty123';
const RED_BORDER = 'rgb(220, 53, 69)';

/** Error messages exactly as specified in requirements */
const ERRORS = {
  nameRequired: 'Name is required',
  nameInvalid: 'Name is invalid',
  nameLength: 'Name has to be from 2 to 20 characters long',
  lastNameRequired: 'Last name is required',
  lastNameInvalid: 'Last name is invalid',
  lastNameLength: 'Last name has to be from 2 to 20 characters long',
  emailRequired: 'Email required',
  emailIncorrect: 'Email is incorrect',
  passwordRequired: 'Password required',
  passwordInvalid:
    'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
  repeatPasswordRequired: 'Re-enter password required',
  passwordsDoNotMatch: 'Passwords do not match.',
};

test.describe('Registration form', () => {
  test.beforeEach(async ({ page }) => {
    await openRegistrationForm(page);
  });

  test('Positive: successful registration with valid data creates user and opens Garage', async ({
    page,
  }) => {
    const form = registrationForm(page);
    const email = generateAqaEmail();

    await fillRegistrationForm(page, {
      name: 'John',
      lastName: 'Doe',
      email,
      password: VALID_PASSWORD,
      repeatPassword: VALID_PASSWORD,
    });

    await expect(form.registerButton).toBeEnabled();
    await form.registerButton.click();

    await expect(page).toHaveURL(/\/panel\/garage/);
    await expect(page.getByRole('heading', { name: 'Garage' })).toBeVisible();
  });

  test.describe('Negative scenarios', () => {
    test('Name: empty field shows "Name is required", red border, Register disabled', async ({
      page,
    }) => {
      const form = registrationForm(page);

      await triggerValidation(form.name);

      await expect(form.fieldError(form.name)).toHaveText(ERRORS.nameRequired);
      await expect(form.name).toHaveCSS('border-color', RED_BORDER);
      await expect(form.name).toHaveClass(/is-invalid/);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Name: length less than 2 characters shows length error', async ({ page }) => {
      const form = registrationForm(page);

      await form.name.fill('A');
      await triggerValidation(form.name);

      await expect(form.fieldError(form.name)).toHaveText(ERRORS.nameLength);
      await expect(form.name).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Name: length more than 20 characters shows length error', async ({ page }) => {
      const form = registrationForm(page);

      await form.name.fill('A'.repeat(21));
      await triggerValidation(form.name);

      await expect(form.fieldError(form.name)).toHaveText(ERRORS.nameLength);
      await expect(form.name).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Name: non-English symbols show "Name is invalid"', async ({ page }) => {
      const form = registrationForm(page);

      await form.name.fill('Іван');
      await triggerValidation(form.name);

      await expect(form.fieldError(form.name)).toHaveText(ERRORS.nameInvalid);
      await expect(form.name).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Last name: empty field shows "Last name is required" and red border', async ({
      page,
    }) => {
      const form = registrationForm(page);

      await triggerValidation(form.lastName);

      await expect(form.fieldError(form.lastName)).toHaveText(ERRORS.lastNameRequired);
      await expect(form.lastName).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Last name: length less than 2 characters shows length error', async ({ page }) => {
      const form = registrationForm(page);

      await form.lastName.fill('B');
      await triggerValidation(form.lastName);

      await expect(form.fieldError(form.lastName)).toHaveText(ERRORS.lastNameLength);
      await expect(form.lastName).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Last name: invalid data shows "Last name is invalid"', async ({ page }) => {
      const form = registrationForm(page);

      await form.lastName.fill('Doe123');
      await triggerValidation(form.lastName);

      await expect(form.fieldError(form.lastName)).toHaveText(ERRORS.lastNameInvalid);
      await expect(form.lastName).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Email: empty field shows "Email required"', async ({ page }) => {
      const form = registrationForm(page);

      await triggerValidation(form.email);

      await expect(form.fieldError(form.email)).toHaveText(ERRORS.emailRequired);
      await expect(form.email).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Email: incorrect format shows "Email is incorrect"', async ({ page }) => {
      const form = registrationForm(page);

      await form.email.fill('not-an-email');
      await triggerValidation(form.email);

      await expect(form.fieldError(form.email)).toHaveText(ERRORS.emailIncorrect);
      await expect(form.email).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Password: empty field shows "Password required"', async ({ page }) => {
      const form = registrationForm(page);

      await triggerValidation(form.password);

      await expect(form.fieldError(form.password)).toHaveText(ERRORS.passwordRequired);
      await expect(form.password).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Password: weak password shows complexity error from requirements', async ({
      page,
    }) => {
      const form = registrationForm(page);

      await form.password.fill('password');
      await triggerValidation(form.password);

      await expect(form.fieldError(form.password)).toHaveText(ERRORS.passwordInvalid);
      await expect(form.password).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Re-enter password: empty field shows "Re-enter password required"', async ({
      page,
    }) => {
      const form = registrationForm(page);

      await triggerValidation(form.repeatPassword);

      await expect(form.fieldError(form.repeatPassword)).toHaveText(
        ERRORS.repeatPasswordRequired,
      );
      await expect(form.repeatPassword).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Re-enter password: mismatch shows "Passwords do not match."', async ({
      page,
    }) => {
      const form = registrationForm(page);

      await form.password.fill(VALID_PASSWORD);
      await form.repeatPassword.fill('OtherPass1');
      await triggerValidation(form.repeatPassword);

      await expect(form.fieldError(form.repeatPassword)).toHaveText(
        ERRORS.passwordsDoNotMatch,
      );
      await expect(form.repeatPassword).toHaveCSS('border-color', RED_BORDER);
      await expect(form.registerButton).toBeDisabled();
    });

    test('Register button is disabled when form data is incorrect', async ({ page }) => {
      const form = registrationForm(page);

      await fillRegistrationForm(page, {
        name: 'John',
        lastName: 'Doe',
        email: generateAqaEmail(),
        password: VALID_PASSWORD,
        // repeatPassword intentionally missing — form is incorrect
      });

      await expect(form.registerButton).toBeDisabled();
    });
  });
});
