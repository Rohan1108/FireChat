// In summary, this code initializes and renders the main App component into the DOM's root element, allowing the React application to start.
// Additionally, it provides the option to register a service worker, which enables the application to work offline and load faster by caching assets.
// However, the service worker is currently unregistered (disabled) by default.
// If you decide to enable it, you can replace serviceWorker.unregister() with serviceWorker.register().
// Import necessary modules from React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';

// Import the main App component and CSS styles
import App from './App';
import './index.css';

// Import the service worker to handle offline capabilities (optional)
import * as serviceWorker from './serviceWorker';

// Render the App component into the root element of the DOM
ReactDOM.render(
  // React.StrictMode is used to identify and log potential issues in the application.
  // It should only be used in development, not in production.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // The root element in the HTML where the App component will be rendered.
  // This is specified by the 'id' attribute in the 'index.html' file.
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// Optional: Unregister the service worker. By default, Create React App uses service workers to cache assets
// for better performance in offline scenarios. However, unregistering it will disable this feature.
serviceWorker.unregister();
