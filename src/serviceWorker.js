// This code provides a set of functions to handle the registration and management of service workers in a React application.
// The service worker is used to cache assets and improve the application's performance, making it available for offline use when visited again.
// The register() function checks if the environment is in production and if the browser supports service workers, and then either registers a new service worker or performs a series of checks for existing service workers when running on localhost.
// The unregister() function allows developers to disable the service worker functionality if needed.
// Check if the current environment is localhost (development)
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

// Function to register a service worker
export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    // Ensure that the service worker's origin matches the app's origin
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // If running on localhost, check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Log additional information for localhost, guiding developers to the service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // If not running on localhost, just register the service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

// Function to register a valid service worker
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // On update found, handle the state change of the service worker
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );

              // Execute the callback if provided
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute the callback if provided
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

// Function to check if the service worker is valid
function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't be found, reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Ensure the service worker exists and that we are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

// Function to unregister the service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
