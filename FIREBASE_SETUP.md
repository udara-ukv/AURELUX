# Firebase Setup (Free Tier)

Follow these steps to connect AURELUX to Firebase (Spark/free plan).

## 1) Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **Add project**
3. Name it (e.g., `aurelux-store`)
4. Disable Google Analytics (optional)
5. Create project

## 2) Create a Web App
1. In your Firebase project, click **</> Web**
2. Register app name (e.g., `aurelux-web`)
3. Copy the Firebase config object

## 3) Add Config to This Project
Open [firebase-config.js](firebase-config.js) and replace the values:

```js
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 4) Enable Firestore Database
1. In Firebase console, go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for dev)
4. Select a location

## 5) Add Sample Products (Firestore)
Create a collection called **products**. Add documents (Auto-ID or set numeric IDs). Each document should have these fields:

```json
{
  "id": 1,
  "name": "Diamond Elegance Ring",
  "category": "jewelry",
  "price": 1299,
  "originalPrice": 1599,
  "rating": 4.8,
  "reviews": 127,
  "image": "https://...",
  "images": ["https://...", "https://..."] ,
  "description": "...",
  "details": ["18K White Gold", "Certified Diamond"],
  "colors": ["Gold", "Silver"],
  "sizes": ["6", "7", "8"],
  "stock": 15
}
```

## 6) Firestore Rules (Dev)
Use open rules for testing (do NOT keep for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 7) Run Locally
```bash
cd /home/udara/Documents/my-webapp
python3 -m http.server 8000
```
Open: http://localhost:8000

## Notes
- If Firebase is not configured, the site continues using local sample data.
- When Firebase is configured, products are loaded from Firestore.
- Newsletter emails are saved to **newsletter** collection.

## Production Tips
- Secure Firestore rules for production.
- Add Firebase Auth providers (Email/Password).
- Move product images to Firebase Storage.
