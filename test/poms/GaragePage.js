export class GaragePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Garage' });
  }

  urlPattern() {
    return /\/panel\/garage/;
  }
}
