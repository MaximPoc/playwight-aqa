export class ProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.profileName = page.locator('.profile_name');
    this.editProfileButton = page.getByRole('button', { name: 'Edit profile' });
  }

  async open() {
    await this.page.goto('/panel/profile');
  }
}
