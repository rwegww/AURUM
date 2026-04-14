import admin from 'firebase-admin';
import { FLAT_KNOWLEDGE_BASE } from '../src/data/theory.js';
import fs from 'fs';
import path from 'path';

/**
 * MIGRATION SCRIPT: Static Theory -> Firestore
 * Robust version that handles multi-line JSON in .env
 */

function getServiceAccount() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Extract JSON using regex (greedy match between { and })
  const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_JSON=({[\s\S]*?^})/m);
  if (match) {
    return JSON.parse(match[1]);
  }
  
  throw new Error('Could not find FIREBASE_SERVICE_ACCOUNT_JSON in .env or it is malformed');
}

async function migrate() {
  console.log('🚀 Starting Knowledge Base Migration to Firestore...');
  
  try {
    const serviceAccount = getServiceAccount();
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();
    const collection = db.collection('kb_theory');

    let count = 0;
    for (const item of FLAT_KNOWLEDGE_BASE) {
      try {
        await collection.doc(item.id).set({
          ...item,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          source: 'static_seed'
        });
        console.log(`✅ Uploaded: ${item.id} - ${item.title}`);
        count++;
      } catch (err) {
        console.error(`❌ Error uploading ${item.id}:`, err);
      }
    }

    console.log(`\n🎉 Migration complete! Total items: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error('💥 MIGRATION FAILED:', err.message);
    process.exit(1);
  }
}

migrate();
