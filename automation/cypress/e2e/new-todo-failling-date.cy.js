// cypress/e2e/new-todo.cy.js

describe('New Todo Creation', () => {
  let todoTitle; // Declare todoTitle outside to be accessible in the second 'it' block

  beforeEach(() => {
    // Visit the base URL (e.g., http://localhost:3000 or whatever is set in cypress.config.js)
    cy.visit('/');
    todoTitle = 'Cypress Test Todo'; // Initialize for each test run
  });

  it('should navigate to the new-task page, fill the form, and save a new todo', () => {
    // 1. Navigate to the new-task page
    // Click the "New Task" button in the header
    cy.get('button[routerlink="/new-task"]').click();

    // Assert that we are on the new-task page (e.g., check the heading)
    cy.url().should('include', '/new-task');
    cy.contains('h2', 'Create To-do').should('be.visible');

    // 2. Fill in the form fields
    const todoDescription = 'This is a description for the Cypress automated todo.';
    const todoLink = 'https://www.cypress.io/';
    const todoShortLink = 'Cypress Docs';
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // Set deadline to 7 days from now
    const deadlineDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    cy.get('input#title')
      .should('be.visible')
      .type(todoTitle)
      .should('have.value', todoTitle);

    cy.get('textarea#description')
      .should('be.visible')
      .type(todoDescription)
      .should('have.value', todoDescription);

    cy.get('select#priority')
      .should('be.visible')
      .select('High') // Select by value or text
      .should('have.value', 'high');

    cy.get('input#deadline')
      .should('be.visible')
      .type(deadlineDate)
      .should('have.value', deadlineDate);

    // Fill optional link fields
    cy.get('input#link')
      .should('be.visible')
      .type(todoLink)
      .should('have.value', todoLink);

    cy.get('input#shortLink')
      .should('be.visible')
      .type(todoShortLink)
      .should('have.value', todoShortLink);

    // 3. Save the new todo
    // The save button is initially disabled. It should become enabled after filling required fields.
    cy.get('button[type="submit"]')
      .should('not.be.disabled') // Assert that the button is enabled
      .click();

    // 4. Assertions after saving and verifying the listing
    // Assuming the app redirects to the homepage or shows the new todo on the listing page
    cy.url().should('not.include', '/new-task'); // Should navigate away from the new-task page

    // Find the row containing the newly created todo by its title
    cy.contains('.task .capitalize', todoTitle)
      .parents('.task') // Get the parent .task element for the row
      .as('newTodoRow'); // Alias it for reusability

    // Verify the description (if displayed on the listing) - based on the provided HTML, description is not directly visible on the listing.
    // If it were, you'd do something like:
    // cy.get('@newTodoRow').find('.todo-description-class').should('contain', todoDescription);

    // Verify the priority
    cy.get('@newTodoRow')
      .find('p.text-xs span') // Selector for the priority span
      .should('contain', 'high'); // Check for the text 'high'

    // Verify the deadline (if displayed on the listing)
    // Format the date to match "Mon DD, YYYY" (e.g., "Jul 29, 2025")
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const expectedDisplayedDateString = new Date(deadlineDate).toLocaleDateString('en-US', options);

    cy.get('@newTodoRow')
      .find('.px-6.py-3.text-gray-900.whitespace-nowrap.hidden.md\\:block.col-span-2') // Selector for the date column
      .invoke('text') // Get the actual text content of the element
      .then((text) => {
        // Clean both the actual text from the DOM and the expected text for robust comparison
        const cleanedActualText = text.trim().replace(/\./g, ''); // Remove periods and trim whitespace
        const cleanedExpectedText = expectedDisplayedDateString.replace(/\./g, '').trim(); // Remove periods and trim whitespace
        expect(cleanedActualText).to.equal(cleanedExpectedText);
      });

    // Verify the link icon is present (assuming the link itself isn't directly displayed)
    cy.get('@newTodoRow')
      .find('a[ng-reflect-router-link^="/task/"]') // Link to task detail page
      .should('have.attr', 'href')
      .and('include', '/task/'); // Check that it links to a task detail page
  });
});
