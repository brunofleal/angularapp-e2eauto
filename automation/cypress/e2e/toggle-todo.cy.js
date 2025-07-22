// cypress/e2e/toggle-todo.cy.js

describe('Todo Completion Toggle', () => {
  const checkableTodoTitle = 'checkable todo';
  const checkableTodoDescription = 'This todo will be created and its checkbox toggled.';

  beforeEach(() => {
    // Visit the base URL before each test
    cy.visit('/');
  });

  it('should create a todo, toggle its checkbox on and off, and verify its state', () => {
    // Calculate a future date for the deadline
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3); // Set deadline for 3 days from now
    const deadlineDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // 1. Navigate to the new-task page and create the todo
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.contains('h2', 'Create To-do').should('be.visible');

    cy.get('input#title').type(checkableTodoTitle);
    cy.get('textarea#description').type(checkableTodoDescription);
    cy.get('select#priority').select('Medium');
    cy.get('input#deadline').type(deadlineDate);

    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/new-task'); // Should navigate away from the new-task page

    // 2. Find the last todo item (which should be the newly created one)
    cy.get('.task').last().as('lastTodoItem'); // Get all .task elements and select the last one

    // Verify the title of the last todo item matches our created todo
    cy.get('@lastTodoItem')
      .find('div.capitalize')
      .should('contain', checkableTodoTitle);

    // 3. Toggle the checkbox ON and verify its state
    cy.get('@lastTodoItem')
      .find('input[type="checkbox"]') // Find the checkbox within this specific todo item
      .click() // Click the checkbox to toggle it on
      .should('be.checked'); // Verify the checkbox is checked

    // Verify the visual indicator (line-through) on the title
    cy.get('@lastTodoItem')
      .find('div.capitalize')
      .should('have.css', 'text-decoration')
      .and('include', 'line-through');

    // 4. Toggle the checkbox OFF and verify its state
    cy.get('@lastTodoItem')
      .find('input[type="checkbox"]')
      .click() // Click the checkbox again to toggle it off
      .should('not.be.checked'); // Verify the checkbox is unchecked

    // Verify the visual indicator (no line-through) on the title
    cy.get('@lastTodoItem')
      .find('div.capitalize')
      .should('not.have.css', 'text-decoration', 'line-through'); // Ensure line-through is absent
  });

  it('should filter todos by completion status (Done/Undone) correctly', () => {
    const doneTodoTitle = 'Done Todo for Filter Test - ';
    const undoneTodoTitle = 'Undone Todo for Filter Test - ';
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deadlineDate = futureDate.toISOString().split('T')[0];

    // 1. Create a "Done" todo
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.get('input#title').type(doneTodoTitle);
    cy.get('textarea#description').type('This todo will be marked as done.');
    cy.get('select#priority').select('High');
    cy.get('input#deadline').type(deadlineDate);
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/new-task');

    // Mark the "Done" todo as complete
    cy.contains('.task .capitalize', doneTodoTitle)
      .parents('.task')
      .find('input[type="checkbox"]')
      .click()
      .should('be.checked');

    // 2. Create an "Undone" todo
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.get('input#title').type(undoneTodoTitle);
    cy.get('textarea#description').type('This todo will remain undone.');
    cy.get('select#priority').select('Low');
    cy.get('input#deadline').type(deadlineDate);
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/new-task');

    // 3. Verify both todos are visible when "All" is selected (default state)
    cy.contains('.task .capitalize', doneTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', undoneTodoTitle).should('be.visible');

    // 4. Filter by "Done"
    cy.get('input[type="radio"][value="done"][name="filter"]').click();

    // Verify only the "Done" todo is visible
    cy.contains('.task .capitalize', doneTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', undoneTodoTitle).should('not.exist'); // Undone todo should not be in the DOM

    // 5. Filter by "Undone"
    cy.get('input[type="radio"][value="to do"][name="filter"]').click(); // Value for Undone is "to do"

    // Verify only the "Undone" todo is visible
    cy.contains('.task .capitalize', undoneTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', doneTodoTitle).should('not.exist'); // Done todo should not be in the DOM

    // Optional: Revert to "All" to clean up or verify all are visible again
    cy.get('input[type="radio"][value="all"][name="filter"]').click();
    cy.contains('.task .capitalize', doneTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', undoneTodoTitle).should('be.visible');
  });

it('should filter todos by priority status (Low/Medium/High) correctly', () => {
    const lowPriorityTodoTitle = 'Low Priority Todo - ';
    const mediumPriorityTodoTitle = 'Medium Priority Todo - ';
    const highPriorityTodoTitle = 'High Priority Todo - ';
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const deadlineDate = futureDate.toISOString().split('T')[0];

    // 1. Create a "Low Priority" todo
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.get('input#title').type(lowPriorityTodoTitle);
    cy.get('textarea#description').type('This is a low priority todo.');
    cy.get('select#priority').select('Low');
    cy.get('input#deadline').type(deadlineDate);
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/new-task');

    // 2. Create a "Medium Priority" todo
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.get('input#title').type(mediumPriorityTodoTitle);
    cy.get('textarea#description').type('This is a medium priority todo.');
    cy.get('select#priority').select('Medium');
    cy.get('input#deadline').type(deadlineDate);
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/new-task');

    // 3. Create a "High Priority" todo
    cy.get('button[routerlink="/new-task"]').click();
    cy.url().should('include', '/new-task');
    cy.get('input#title').type(highPriorityTodoTitle);
    cy.get('textarea#description').type('This is a high priority todo.');
    cy.get('select#priority').select('High');
    cy.get('input#deadline').type(deadlineDate);
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/new-task');

    // 4. Verify all three todos are visible when no priority filter is applied (default state)
    cy.contains('.task .capitalize', lowPriorityTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', mediumPriorityTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', highPriorityTodoTitle).should('be.visible');

    // 5. Filter by "Low" priority
    // Corrected: name attribute is "priority"
    cy.get('input[type="radio"][value="low"][name="priority"]').click();

    // Verify only the "Low Priority" todo is visible
    cy.contains('.task .capitalize', lowPriorityTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', mediumPriorityTodoTitle).should('not.exist');
    cy.contains('.task .capitalize', highPriorityTodoTitle).should('not.exist');

    // 6. Filter by "Medium" priority
    // Corrected: name attribute is "priority"
    cy.get('input[type="radio"][value="medium"][name="priority"]').click();

    // Verify only the "Medium Priority" todo is visible
    cy.contains('.task .capitalize', mediumPriorityTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', lowPriorityTodoTitle).should('not.exist');
    cy.contains('.task .capitalize', highPriorityTodoTitle).should('not.exist');

    // 7. Filter by "High" priority
    // Corrected: name attribute is "priority"
    cy.get('input[type="radio"][value="high"][name="priority"]').click();

    // Verify only the "High Priority" todo is visible
    cy.contains('.task .capitalize', highPriorityTodoTitle).should('be.visible');
    cy.contains('.task .capitalize', lowPriorityTodoTitle).should('not.exist');
    cy.contains('.task .capitalize', mediumPriorityTodoTitle).should('not.exist');

    // Note: There is no "all" radio button for priority in the provided HTML.
    // If you add one in your application, you can uncomment and adjust the following:
    // 8. Revert to "All" priority to clean up or verify all are visible again
    // cy.get('input[type="radio"][value="all"][name="priority"]').click();
    // cy.contains('.task .capitalize', lowPriorityTodoTitle).should('be.visible');
    // cy.contains('.task .capitalize', mediumPriorityTodoTitle).should('be.visible');
    // cy.contains('.task .capitalize', highPriorityTodoTitle).should('be.visible');
  });
});
