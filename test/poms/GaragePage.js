export class GaragePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Garage' });
    this.addCarButton = page.getByRole('button', { name: 'Add car' });
  }

  urlPattern() {
    return /\/panel\/garage/;
  }

  async open() {
    await this.page.goto('/panel/garage');
  }
}
