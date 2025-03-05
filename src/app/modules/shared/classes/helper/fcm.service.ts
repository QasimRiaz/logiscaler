import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FcmService {

    private messaging;

    constructor(private http: HttpClient) {
        // Initialize Firebase messaging
        this.messaging = getMessaging();
    }

    processUsers(users: any[]): void {
        users.forEach((user) => {
            getToken(this.messaging, { vapidKey: environment.vapidKey })
                .then((currentToken) => {
                    if (currentToken) {
                        this.sendTokenToFcm(user, currentToken);
                    } else {
                        console.log(`No FCM token available for ${user.email}`);
                    }
                })
                .catch((err) => {
                    console.error(`Error retrieving FCM token for ${user.email}:`, err);
                });
        });
    }

    sendTokenToFcm(user: any, token: string): void {
        const fcmPayload = {
            notification: {
                title: 'Hello!',
                body: 'This is a notification from Angular!',
            },
            to: token,
        };

        console.log('Sending notification to FCM:', fcmPayload);

        // Use the FCM HTTP endpoint
        const fcmUrl = 'https://fcm.googleapis.com/fcm/send';

        // Include the FCM server key in the headers
        const headers = {
            Authorization: `key=YOUR_FCM_SERVER_KEY`, // Replace with your actual FCM server key
            'Content-Type': 'application/json',
        };

        // Send the notification
        this.http.post(fcmUrl, fcmPayload, { headers }).subscribe({
            next: () => console.log(`Notification sent successfully to ${user.email}`),
            error: (err) => console.error(`Error sending notification to ${user.email}:`, err),
        });
    }

}
