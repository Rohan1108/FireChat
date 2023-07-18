// This code is a simple unit test for the App component using the testing-library's render function.
// The test ensures that when the App component is rendered, it contains an element with the text "learn react."
// The getByText method from the testing-library is used to find the element with the specified text, and the expect function is used to assert that the element is present in the virtual DOM.
// If the element is not found, the test will fail. The purpose of this test is to check if the "learn react" link is being rendered correctly in the App component.
// Import necessary modules from React and testing library
import React from 'react';
import { render } from '@testing-library/react';

// Import the main App component
import App from './App';

// Test case to check if the "learn react" link is rendered in the App
test('renders learn react link', () => {
  // Render the App component into a virtual DOM using testing-library
  const { getByText } = render(<App />);
  
  // Use the getByText method to find the element containing the text "learn react"
  const linkElement = getByText(/learn react/i);
  
  // Assert that the linkElement is present in the virtual DOM
  expect(linkElement).toBeInTheDocument();
});
