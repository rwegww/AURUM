import admin from 'firebase-admin';

let app;

// In a real environment, you should use a service account key file
// For this tutorial, we will expect FIREBASE_SERVICE_ACCOUNT_JSON env var 
// OR a file at service-account.json

const initializeFirebase = () => {
  if (app) return app;

  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    let serviceAccount;

    if (serviceAccountVar) {
      serviceAccount = JSON.parse(serviceAccountVar);
    } else {
      // Fallback to local file if it exists
      // admin.initializeApp({ credential: admin.credential.cert('path/to/key.json') });
      console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not found. Firebase Admin will not work until configured.');
      return null;
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    return app;
  } catch (err) {
    console.error('Lỗi khởi tạo Firebase Admin:', err.message);
    return null;
  }
};

export const firebaseAdmin = {
  verifyToken: async (token) => {
    const firebaseApp = initializeFirebase();
    if (!firebaseApp) throw new Error('Firebase Admin not configured');
    return admin.auth().verifyIdToken(token);
  }
};

export default firebaseAdmin;
