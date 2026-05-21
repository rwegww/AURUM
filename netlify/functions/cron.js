import { schedule } from '@netlify/functions';

export const handler = schedule('* * * * *', async (event) => {
  const siteUrl = process.env.URL || 'http://localhost:5000';
  
  try {
    console.log('[Netlify Cron] Triggering reminder check...');
    
    const headers = {};
    if (process.env.CRON_SECRET) {
      headers['Authorization'] = `Bearer ${process.env.CRON_SECRET}`;
    }

    const response = await fetch(`${siteUrl}/api/user/cron-send-reminders`, {
      method: 'GET',
      headers,
    });
    
    const result = await response.json();
    console.log('[Netlify Cron] Result:', result);
    
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error('[Netlify Cron] Failed to ping route:', error);
    return {
      statusCode: 500,
    };
  }
});
