// client-logger.js - simple client-side error queue and Firestore logger
window.__clientLogQueue = window.__clientLogQueue || [];

function enqueueClientLog(entry) {
  window.__clientLogQueue.push({ ...entry, createdAt: new Date().toISOString() });
  tryFlushClientLogs();
}

function tryFlushClientLogs() {
  if (!window.db || !window.firebaseInitialized) return;
  if (!window.__clientLogQueue || window.__clientLogQueue.length === 0) return;

  const batch = window.db.batch ? window.db.batch() : null;
  const collectionRef = window.db.collection('client_logs');

  const items = window.__clientLogQueue.splice(0, 20);
  items.forEach(item => {
    try {
      collectionRef.add({ ...item, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    } catch (e) {
      console.warn('client log write failed', e);
    }
  });
}

window.addEventListener('error', function (event) {
  try {
    const entry = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error && event.error.stack ? event.error.stack : null,
      userAgent: navigator.userAgent
    };
    enqueueClientLog(entry);
  } catch (e) {
    console.warn('Error capturing client error', e);
  }
});

window.addEventListener('unhandledrejection', function (event) {
  try {
    enqueueClientLog({ message: 'UnhandledRejection', reason: (event.reason && event.reason.message) || String(event.reason), userAgent: navigator.userAgent });
  } catch (e) {
    console.warn('Error capturing unhandled rejection', e);
  }
});

// Periodic flush
setInterval(tryFlushClientLogs, 10000);
