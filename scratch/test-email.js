import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'] });

import { sendTeacherApprovalEmail } from '../api/lib/mailer.js';

async function test() {
  console.log('Host:', process.env.SMTP_HOST);
  console.log('User:', process.env.SMTP_USER);
  const res = await sendTeacherApprovalEmail('zsky730@gmail.com', 'heaa');
  console.log('Result:', res);
}

test();
