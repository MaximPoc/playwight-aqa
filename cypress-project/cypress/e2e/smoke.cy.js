describe('QAuto smoke', () => {
  it('opens landing page with basic auth', () => {
    cy.visit('/', {
      auth: {
        username: 'guest',
        password: 'welcome2qauto',
      },
    });

    cy.contains('button', 'Sign In').should('be.visible');
    cy.contains('button', 'Sign up').should('be.visible');
  });
});
