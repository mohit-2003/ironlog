# Updating from the first version
Upload everything in `public/` again (including the new `config.js` and `exercises.json`), then paste your Firebase values into `config.js`. After that, future updates never need re-pasting. Reload the app twice.

# Ironlog setup (about 20 minutes)

## 1. Firebase project
1. console.firebase.google.com -> Add project (free Spark plan is fine).
2. Project settings -> Your apps -> Web (</>) -> register. Copy the config values into `public/config.js` (this one file holds all your keys).
3. Build -> Authentication -> Sign-in method -> enable **Google**.
   Then Settings -> Authorized domains -> add the domain you will host on.
4. Build -> Firestore Database -> Create (production mode) -> Rules tab -> paste `firestore.rules` -> Publish.
5. Project settings -> Cloud Messaging -> Web Push certificates -> Generate key pair. Paste the public key into `VAPID` in `public/config.js`.

## 2. Host it (pick one, HTTPS is required)
- **Shared hosting:** upload everything inside `public/` to a folder or subdomain that has SSL. Done.
- **Firebase Hosting:** `npm i -g firebase-tools`, `firebase login`, `firebase init` (choose existing project, keep existing files), then `firebase deploy --only hosting,firestore:rules`.

## 3. Reminders (push notifications)
Reminders are sent by a Cloud Function, which needs the **Blaze** (pay-as-you-go) plan. Usage this small stays inside the free quota; set a budget alert anyway.
```
cd functions && npm install && cd ..
firebase deploy --only functions
```
Without this step the app works fully, you just won't get push reminders. Reminders can arrive up to 15 minutes after the set time.

## 4. On your phone
Open the link in Chrome -> menu -> Install app -> Settings tab -> turn on notifications.
iPhone: needs iOS 16.4+, and the app must be added to the Home Screen first.

## Friends
Send them the link. Each person signs in with Google and gets a private account (rules enforce this).
