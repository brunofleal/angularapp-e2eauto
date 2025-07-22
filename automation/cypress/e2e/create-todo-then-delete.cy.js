// cypress/e2e/delete-todo.cy.js

describe('Todo Creation and Deletion Flow', () => {
  const todoToDeleteTitle = 'to delete todo';
  const todoToDeleteDescription = 'This todo will be created and then deleted.';

  beforeEach(() => {
    // Visit the base URL before each test
    cy.visit('/');
  });

  it('should create a todo, verify its creation, then delete it and verify its removal', () => {
    // Calculate a future date for the deadline
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Set deadline for tomorrow
    const deadlineDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // 1. Navigate to the new-task page
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.contains('h2', 'Create To-do').should('be.visible');

    // 2. Fill in the form fields for the todo to be deleted
    cy.get('input#title')
      .should('be.visible')
      .type(todoToDeleteTitle)
      .should('have.value', todoToDeleteTitle);

    cy.get('textarea#description')
      .should('be.visible')
      .type(todoToDeleteDescription)
      .should('have.value', todoToDeleteDescription);

    cy.get('select#priority')
      .should('be.visible')
      .select('Low') // Set priority to Low for this test
      .should('have.value', 'low');

    cy.get('input#deadline')
      .should('be.visible')
      .type(deadlineDate)
      .should('have.value', deadlineDate);

    // No need to fill link fields for this specific test, but they could be added if needed.

    // 3. Save the new todo
    cy.get('button[type="submit"]')
      .should('not.be.disabled') // Ensure the save button is enabled
      .click();

    // 4. Verify navigation away from the new-task page
    cy.url().should('not.include', '/new-task');

    // 5. Verify the todo was correctly created and is visible in the listing
    cy.contains('.task .capitalize', todoToDeleteTitle)
      .parents('.task') // Get the parent .task element (the row)
      .as('deleteTodoRow'); // Alias the row for easier reference

    cy.get('@deleteTodoRow').should('be.visible'); // Ensure the row is present and visible

    // Optional: Verify other details if needed, similar to the previous test
    // For example, verify priority for the created todo:
    cy.get('@deleteTodoRow').find('p.text-xs span').should('contain', 'low');

    // 6. Perform the delete operation
    cy.get('@deleteTodoRow')
      .find('button.font-medium.text-red-400') // Selector for the trash icon button
      .click();

    // 7. Verify it was successful (the todo is no longer present in the DOM)
    // Cypress will automatically retry this assertion until the element is gone or a timeout occurs.
    cy.contains('.task .capitalize', todoToDeleteTitle).should('not.exist');
  });
});
