# Testing Homework

Now that we have enriched the experience of the users of the Lotteries app by implementing new features, our Tech Lead suggested that it would be a great time to introduce tests for the app. This will help us to feel more comfortable with the product we’re building since we will be sure that already existing features will work as expected, which influence directly scaling process.

Tests are a crucial point from the business perspective since the Board believes that writing them now will impact customer satisfaction in a long-term way.

### Homework management 🏠

The final result of all homework is the React Native Application full of features implemented iteratively in the end phase of each module in the course.

Each module in the course will end up with homework consisting of a few tasks to fulfill. We would like to suggest a comfortable system for you to submit each task of the homework as a separate PR to the main branch in your repository. This will create a space for us to communicate with you, by doing code reviews - thanks to that we will be able to check your homework, discuss some uncertainties, or respond to questions you will leave in the PR. In case you have any trouble with homework you can always book a 1 to 1 session with the trainer, and also don't hesitate to ask your questions in the dedicated communication channel. Keep in mind that you don't have to worry about being blocked for the next homework, every homework will have a starting point, so you always will be able to override the content of your repository with the prepared starting point.

### The goal of this module’s homework

The goal of this homework is to extend the existing mobile app with tests.

## Part 1: Add unit tests

<details>
  <summary><b>Step 1. Identify Areas to Add Tests</b></summary><br>

Before you start writing tests, identify the key functionalities of your React Native app that need to be tested. This could include components, hooks, utility functions, and more.
</details>

<details>
  <summary><b>Step 2. Write Test Suites</b></summary><br>

- Create a `__tests__` folder in the same directory as your source code.
- For each module or component you want to test, create a corresponding test file using the format `<module-name>.test.js` or `<component-name>.test.js.`
- Write your test suites and test cases using Jest's testing utilities and React Native Testing Library.
</details>

<details>
  <summary><b>Step 3. Run tests</b></summary><br>

Run your tests using the following command:

  ```
  npm run test
  ```
</details>

<details>
  <summary><b>Step 4. Monitor Code Coverage</b></summary><br>

Jest provides code coverage reports that help you identify which parts of your codebase are covered by tests. You can enable code coverage by adding the --coverage flag to your test command:

  ```
  npm run test -- --coverage
  ```

This will generate coverage reports in the coverage directory of your project. Open the HTML report in a browser to see detailed coverage information.
</details>

## Part 2: Add integration tests

<details>
  <summary><b>Step 1. Identify Integration Points</b></summary><br>

Determine the areas of your app where different components or units interact. These could include interactions between components, data flows, state management, API calls, navigation, etc.
</details>

<details>
  <summary><b>Step 2. Write Integration Tests</b></summary><br>

- For each integration point, create an integration test file. Name the file based on the interaction you're testing
- Write test cases that simulate the interactions and verify that the expected outcomes are achieved.
</details>

<details>
  <summary><b>Step 3. Run integration tests</b></summary><br>

Run your tests using the following command:

  ```
  npm run test
  ```
</details>

<details>
  <summary><b>Step 4. Review and Refine</b></summary><br>

Review the test results and make sure the interactions between different parts of your app are working as expected. If any issues are detected, refine your code and tests accordingly.
</details>

## Part 3: Introduce single snapshot test

<b>Step 1. Implement a snapshot test for the SearchInput component</b>
<br/><br/>
<b>Step 2. Run and generate the snapshot - preview the final result</b>
<br/><br/>
<b>Step 3. Try to modify the SearchInput component and run the test again without updating the snapshot</b>

> 💡 - Remember about reverting your changes back!

## Part 4: Implement two e2e flows with the usage of Maestro

<details>
  <summary><b>Step 1. Implement add lottery flow</b></summary><br>

This task target to verify whether the functionality of adding lotteries work as expected, so in that flow, we have to enter the adding lottery form, input necessary information and check whether the item was successfully added as expected.

> Hint: In order to press a button without text information add `testID` property and access them using `testID`
</details>

<details>
  <summary><b>Step 2. Implement flow that verifies if settings work</b></summary><br>

In that specific flow, we expect to have a properly working settings tab and hide the add lottery button functionality. Within the test, we need to enter the settings screen, toggle the switch responsible for storing information about the availability of adding lottery functionality, and after that expect to not see the FAB component on the Lotteries Screen.

> Hint: In order to press a button without text information add `testID` property and access them using `testID`
</details>

> 💡 - Try to create one of the tests interactively with the usage of Maestro Studio
