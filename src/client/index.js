import axios from "axios";

import { apiLinks } from "../connection.config";

const publicVapidKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;
const urlBase64ToUint8Array = (base64String) => {
    // console.log(base64String);
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const Subscribe = async () => {
    if (!('serviceWorker' in navigator)) return;
  
    const registration = await navigator.serviceWorker.ready;
  
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    
    const today = new Date().toISOString();

    await axios.post(apiLinks.subscribe, 
            JSON.stringify({subscription: subscription, today: today}), {
        headers: {
            'content-type': 'application/json',
        }
    });
};

export const Broadcast = async () => {
    await axios.get(apiLinks.broadcast, {
        headers: {
            'content-type': 'application/json',
        },
    });
};

