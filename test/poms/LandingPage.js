export class LandingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
  }

  async open() {
    await this.page.goto('/');
  }

  async clickSignUp() {
    await this.signUpButton.click();
  }
}
