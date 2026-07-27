// @ts-check
import { test, expect } from '@playwright/test';
import { LandingPage, RegistrationDialog, GaragePage } from './poms/index.js';
import { generateAqaEmail } from './utils/user.util.js';

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

/** @type {LandingPage} */
let landingPage;
/** @type {RegistrationDialog} */
let registrationDialog;
/** @type {GaragePage} */
let garagePage;

test.describe('Registration form', () => {
  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    registrationDialog = new RegistrationDialog(page);
    garagePage = new GaragePage(page);

    await landingPage.open();
    await landingPage.clickSignUp();
    await registrationDialog.waitForVisible();
  });

  test('Positive: successful registration with valid data creates user and opens Garage', async ({
    page,
  }) => {
    const email = generateAqaEmail();

    await registrationDialog.fill({
      name: 'John',
      lastName: 'Doe',
      email,
      password: VALID_PASSWORD,
      repeatPassword: VALID_PASSWORD,
    });

    await expect(registrationDialog.registerButton).toBeEnabled();
    await registrationDialog.register();

    await expect(page).toHaveURL(garagePage.urlPattern());
    await expect(garagePage.heading).toBeVisible();
  });

  test.describe('Negative scenarios', () => {
    test('Name: empty field shows "Name is required", red border, Register disabled', async () => {
      await registrationDialog.triggerValidation(registrationDialog.nameInput);

      await expect(registrationDialog.fieldError(registrationDialog.nameInput)).toHaveText(
        ERRORS.nameRequired,
      );
      await expect(registrationDialog.nameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.nameInput).toHaveClass(/is-invalid/);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Name: length less than 2 characters shows length error', async () => {
      await registrationDialog.nameInput.fill('A');
      await registrationDialog.triggerValidation(registrationDialog.nameInput);

      await expect(registrationDialog.fieldError(registrationDialog.nameInput)).toHaveText(
        ERRORS.nameLength,
      );
      await expect(registrationDialog.nameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Name: length more than 20 characters shows length error', async () => {
      await registrationDialog.nameInput.fill('A'.repeat(21));
      await registrationDialog.triggerValidation(registrationDialog.nameInput);

      await expect(registrationDialog.fieldError(registrationDialog.nameInput)).toHaveText(
        ERRORS.nameLength,
      );
      await expect(registrationDialog.nameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Name: non-English symbols show "Name is invalid"', async () => {
      await registrationDialog.nameInput.fill('Іван');
      await registrationDialog.triggerValidation(registrationDialog.nameInput);

      await expect(registrationDialog.fieldError(registrationDialog.nameInput)).toHaveText(
        ERRORS.nameInvalid,
      );
      await expect(registrationDialog.nameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Last name: empty field shows "Last name is required" and red border', async () => {
      await registrationDialog.triggerValidation(registrationDialog.lastNameInput);

      await expect(registrationDialog.fieldError(registrationDialog.lastNameInput)).toHaveText(
        ERRORS.lastNameRequired,
      );
      await expect(registrationDialog.lastNameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Last name: length less than 2 characters shows length error', async () => {
      await registrationDialog.lastNameInput.fill('B');
      await registrationDialog.triggerValidation(registrationDialog.lastNameInput);

      await expect(registrationDialog.fieldError(registrationDialog.lastNameInput)).toHaveText(
        ERRORS.lastNameLength,
      );
      await expect(registrationDialog.lastNameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Last name: invalid data shows "Last name is invalid"', async () => {
      await registrationDialog.lastNameInput.fill('Doe123');
      await registrationDialog.triggerValidation(registrationDialog.lastNameInput);

      await expect(registrationDialog.fieldError(registrationDialog.lastNameInput)).toHaveText(
        ERRORS.lastNameInvalid,
      );
      await expect(registrationDialog.lastNameInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Email: empty field shows "Email required"', async () => {
      await registrationDialog.triggerValidation(registrationDialog.emailInput);

      await expect(registrationDialog.fieldError(registrationDialog.emailInput)).toHaveText(
        ERRORS.emailRequired,
      );
      await expect(registrationDialog.emailInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Email: incorrect format shows "Email is incorrect"', async () => {
      await registrationDialog.emailInput.fill('not-an-email');
      await registrationDialog.triggerValidation(registrationDialog.emailInput);

      await expect(registrationDialog.fieldError(registrationDialog.emailInput)).toHaveText(
        ERRORS.emailIncorrect,
      );
      await expect(registrationDialog.emailInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Password: empty field shows "Password required"', async () => {
      await registrationDialog.triggerValidation(registrationDialog.passwordInput);

      await expect(registrationDialog.fieldError(registrationDialog.passwordInput)).toHaveText(
        ERRORS.passwordRequired,
      );
      await expect(registrationDialog.passwordInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Password: weak password shows complexity error from requirements', async () => {
      await registrationDialog.passwordInput.fill('password');
      await registrationDialog.triggerValidation(registrationDialog.passwordInput);

      await expect(registrationDialog.fieldError(registrationDialog.passwordInput)).toHaveText(
        ERRORS.passwordInvalid,
      );
      await expect(registrationDialog.passwordInput).toHaveCSS('border-color', RED_BORDER);
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Re-enter password: empty field shows "Re-enter password required"', async () => {
      await registrationDialog.triggerValidation(registrationDialog.repeatPasswordInput);

      await expect(
        registrationDialog.fieldError(registrationDialog.repeatPasswordInput),
      ).toHaveText(ERRORS.repeatPasswordRequired);
      await expect(registrationDialog.repeatPasswordInput).toHaveCSS(
        'border-color',
        RED_BORDER,
      );
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Re-enter password: mismatch shows "Passwords do not match."', async () => {
      await registrationDialog.passwordInput.fill(VALID_PASSWORD);
      await registrationDialog.repeatPasswordInput.fill('OtherPass1');
      await registrationDialog.triggerValidation(registrationDialog.repeatPasswordInput);

      await expect(
        registrationDialog.fieldError(registrationDialog.repeatPasswordInput),
      ).toHaveText(ERRORS.passwordsDoNotMatch);
      await expect(registrationDialog.repeatPasswordInput).toHaveCSS(
        'border-color',
        RED_BORDER,
      );
      await expect(registrationDialog.registerButton).toBeDisabled();
    });

    test('Register button is disabled when form data is incorrect', async () => {
      await registrationDialog.fill({
        name: 'John',
        lastName: 'Doe',
        email: generateAqaEmail(),
        password: VALID_PASSWORD,
        // repeatPassword intentionally missing — form is incorrect
      });

      await expect(registrationDialog.registerButton).toBeDisabled();
    });
  });
});
