const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200', // Replace with your web app's URL
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});