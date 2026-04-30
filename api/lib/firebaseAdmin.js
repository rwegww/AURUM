import admin from 'firebase-admin';

let app;

const initializeFirebase = () => {
  if (admin.apps.length > 0) return admin.apps[0];

  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    let serviceAccount;

    if (serviceAccountVar) {
      serviceAccount = JSON.parse(serviceAccountVar);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized with service account.');
      return app;
    } else {
      // Initialize without service account - use project ID only
      // This allows verifyIdToken to work by fetching Google's public keys
      const projectId = process.env.FIREBASE_PROJECT_ID || 'khoaluan-2026';
      app = admin.initializeApp({
        projectId
      });
      console.log('✅ Firebase Admin initialized with project ID:', projectId);
      return app;
    }
  } catch (err) {
    console.error('Lỗi khởi tạo Firebase Admin:', err.message);
    return null;
  }
};

export const firebaseAdmin = {
  verifyToken: async (token) => {
    const firebaseApp = initializeFirebase();
    if (!firebaseApp) throw new Error('Firebase Admin not configured');
    return firebaseApp.auth().verifyIdToken(token);
  }
};

export default firebaseAdmin;
