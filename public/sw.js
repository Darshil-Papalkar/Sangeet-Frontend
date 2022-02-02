this.addEventListener('push', (e) => {
    
    const data = e.data.json();
    return this.registration.showNotification(data.title, {
        action: data.action,
        body: data.body,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        icon: data.icon,
    });

});


