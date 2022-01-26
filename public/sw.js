this.addEventListener('push', (e) => {
    const data = e.data.json();
    this.registration.showNotification(data.title, {
        action: data.action,
        body: data.body,
        icon: data.icon
    });
});
