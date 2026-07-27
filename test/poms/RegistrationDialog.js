export class RegistrationDialog {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modal = page.locator('app-signup-modal');
    this.nameInput = page.locator('#signupName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.passwordInput = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');
    this.registerButton = this.modal.getByRole('button', { name: 'Register' });
  }

  async waitForVisible() {
    await this.modal.waitFor({ state: 'visible' });
  }

  /**
   * @param {import('@playwright/test').Locator} field
   */
  fieldError(field) {
    return field
      .locator('xpath=ancestor::div[contains(@class,"form-group")]')
      .locator('.invalid-feedback');
  }

  /**
   * @param {import('@playwright/test').Locator} field
   */
  async triggerValidation(field) {
    await field.focus();
    await field.blur();
  }

  /**
   * @param {{
   *   name?: string,
   *   lastName?: string,
   *   email?: string,
   *   password?: string,
   *   repeatPassword?: string,
   * }} data
   */
  async fill(data) {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.repeatPassword !== undefined) {
      await this.repeatPasswordInput.fill(data.repeatPassword);
    }
  }

  async register() {
    await this.registerButton.click();
  }
}
