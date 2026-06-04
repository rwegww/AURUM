import dotenv from 'dotenv';
import User from '../api/models/User.js';

dotenv.config();

async function createAccounts() {
  try {
    console.log("Äang táº¡o tÃ i khoáº£n Admin...");
    let admin = null;
    try {
        admin = await User.findOne({ username: 'admin' });
    } catch(_e) {
        // Continue and create the account if lookup fails.
    }
    
    if (admin) {
        console.log("TÃ i khoáº£n admin Ä‘Ã£ tá»“n táº¡i.");
    } else {
        await User.create({
            username: 'admin',
            email: 'admin@chemodyssey.com',
            password: 'password123',
            role: 'admin'
        });
        console.log("ÄÃ£ táº¡o tÃ i khoáº£n Admin thÃ nh cÃ´ng! (TÃ i khoáº£n: admin / Máº­t kháº©u: password123)");
    }

    console.log("Äang táº¡o tÃ i khoáº£n GiÃ¡o viÃªn...");
    let teacher = null;
    try {
        teacher = await User.findOne({ username: 'teacher' });
    } catch(_e) {
        // Continue and create the account if lookup fails.
    }
    
    if (teacher) {
        console.log("TÃ i khoáº£n teacher Ä‘Ã£ tá»“n táº¡i.");
    } else {
        await User.create({
            username: 'teacher',
            email: 'teacher@chemodyssey.com',
            password: 'password123',
            role: 'teacher'
        });
        console.log("ÄÃ£ táº¡o tÃ i khoáº£n GiÃ¡o viÃªn thÃ nh cÃ´ng! (TÃ i khoáº£n: teacher / Máº­t kháº©u: password123)");
    }

  } catch (err) {
    console.error("Lá»—i khi táº¡o tÃ i khoáº£n:", err);
  }
}

createAccounts();

