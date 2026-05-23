import fetch from 'node-fetch';

export const sendTelegramMessage = async (chatId, text) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !chatId) return false;
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
    return response.ok;
  } catch (error) {
    console.error('Ngoại lệ khi gọi Telegram API:', error);
    return false;
  }
};
