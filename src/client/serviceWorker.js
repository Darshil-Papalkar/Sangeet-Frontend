export function register(){
    if('serviceWorker' in navigator){
        const url = "http://localhost:3000/sw.js";
        navigator.serviceWorker.register(url, {
            scope: '/',
        })
        .then(function(registration) {
            registration.addEventListener('updatefound', function() {
              // If updatefound is fired, it means that there's
              // a new service worker being installed.
              var installingWorker = registration.installing;
              console.log('A new service worker is being installed:',
                installingWorker);
        
              // You can listen for changes to the installing service worker's
              // state via installingWorker.onstatechange
            });
            // registration.addEventListener('pushsubscriptionchange', function(event) {
            //     console.log(event);
            // });
        })
        .catch(function(error) {
            console.log('Service worker registration failed:', error);
        });
    }
    else {
        console.log('Service workers are not supported.');
    }
};