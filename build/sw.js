this.addEventListener('fetch', (event) => {

});

this.addEventListener('push', (e) => {
    
    const data = e.data.json();
    return this.registration.showNotification(data.title, {
        action: data.action,
        body: JSON.parse(data.body).body,
        icon: data.icon,
        data: {
            url: JSON.parse(data.body).url,
        }
    });
});

this.addEventListener("notificationclick", e => {
    e.notification.close();
    e.waitUntil(
        // eslint-disable-next-line no-undef
        clients.openWindow(e.notification.data.url)
    );
});
