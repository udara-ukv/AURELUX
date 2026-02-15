(function initFirebase() {
    try {
        if (!window.firebaseConfig || !window.firebaseConfig.apiKey || String(window.firebaseConfig.apiKey).includes("YOUR_")) {
            console.warn("Firebase not configured. Using local data only.");
            window.firebaseInitialized = false;
            return;
        }

        firebase.initializeApp(window.firebaseConfig);
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        window.firebaseInitialized = true;
        console.info("Firebase initialized.");
    } catch (error) {
        console.error("Firebase init failed:", error);
        window.firebaseInitialized = false;
    }
})();
