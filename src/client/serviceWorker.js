export function register(){
    if('serviceWorker' in navigator){
        // const url = "http://localhost:3000/sw.js"; // local testing url
        // const url = "http://localhost:5000/sw.js"; // local build url
        const url = "https://sangeet.tech/sw.js" // production url
        navigator.serviceWorker.register(url, {
            scope: '/',
        })
        .then(function(registration) {
            registration.addEventListener('updatefound', function() {
              // If updatefound is fired, it means that there's
              // a new service worker being installed.
              const installingWorker = registration.installing;
              console.log('A new service worker is being installed:',
                installingWorker);
            });

            registration.addEventListener('pushsubscriptionchange', function(event) {
                console.log("Pushsubscriptionchange", event);
            });
        })
        .catch(function(error) {
            console.log('Service worker registration failed:', error);
        });
    }
    else {
        console.log('Service workers are not supported.');
    }
};