# Angular Todo App & Cypress Automation

This repository contains two main projects:

- **todoapp/**: Angular web application for managing todos.
- **automation/**: Cypress automation suite for end-to-end testing of the Angular app.

---

## Running the Angular Todo App

1. Navigate to the `todoapp` folder:
    ```bash
    cd todoapp
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run start
    ```
4. The app will be available at [http://localhost:4200](http://localhost:4200).

---

## Running Cypress Automation Tests

1. Ensure the Angular app is running locally (see above).
2. Navigate to the `automation` folder:
    ```bash
    cd automation
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Run Cypress tests in interactive mode:
    ```bash
    npx cypress:open
    ```
    Or run tests in headless mode:
    ```bash
    npx cypress:run
    ```

---

## Project Structure

```
├── todoapp/      # Angular web application
└── automation/   # Cypress end-to-end tests
```

---

## Notes

- Make sure both folders have their own `node_modules` installed.
- The Cypress tests assume the Angular app is running on `localhost:4200` by default.
