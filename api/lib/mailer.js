import nodemailer from 'nodemailer';

// Create a reusable transporter
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SMTP credentials are missing. Set SMTP_HOST, SMTP_USER and SMTP_PASS to send real emails.');
  }

  console.log('SMTP credentials not found in env, creating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Generic sendMail function (used as default export for admin.js compatibility)
const sendMail = async ({ to, subject, html }) => {
  try {
    if (!to || typeof to !== 'string') {
      return { success: false, error: 'Missing recipient email address.' };
    }

    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Hoc vien Hoa hoc Aurum" <no-reply@aurum-academy.org>',
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    if (!process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`Preview URL: ${previewUrl}`);
      return { success: true, previewUrl };
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

export default sendMail;

export const sendStudyPlanConfirmationEmail = async (toEmail, username, planData) => {
  const { dailyLessonTarget } = planData;
  return sendMail({
    to: toEmail,
    subject: 'ðŸŒ± Káº¿ hoáº¡ch há»c táº­p cá»§a báº¡n Ä‘Ã£ sáºµn sÃ ng! - Há»c viá»‡n Aurum',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; padding: 35px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <div style="text-align: center; margin-bottom: 15px;">
          <span style="font-size: 44px;">ðŸŽ’</span>
        </div>
        <h2 style="color: #059669; text-align: center; margin-top: 10px; font-weight: 800; font-size: 22px;">ChÃ o má»«ng báº¡n tham gia káº¿ hoáº¡ch há»c táº­p!</h2>
        <p>Xin chÃ o <strong>${username}</strong>,</p>
        <p>Káº¿ hoáº¡ch há»c táº­p cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c kÃ­ch hoáº¡t thÃ nh cÃ´ng. ChÃºng mÃ¬nh sáº½ Ä‘á»“ng hÃ nh cÃ¹ng báº¡n trÃªn con Ä‘Æ°á»ng lÃ m chá»§ kiáº¿n thá»©c HÃ³a há»c nhÃ©! âœ¨</p>
        
        <div style="background-color: #f0fdf4; padding: 18px; border-radius: 16px; margin: 25px 0; border: 1px solid #bbf7d0; text-align: center;">
          <span style="font-size: 15px; font-weight: bold; color: #166534;">ðŸ“š Má»¥c tiÃªu cá»§a báº¡n: ${dailyLessonTarget} bÃ i há»c má»—i ngÃ y</span>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Háº±ng ngÃ y, náº¿u báº¡n chÆ°a hoÃ n thÃ nh má»¥c tiÃªu há»c táº­p cá»§a ngÃ y Ä‘Ã³, há»‡ thá»‘ng sáº½ gá»­i má»™t email nháº¯c nhá»Ÿ nháº¹ nhÃ ng Ä‘á»ƒ giÃºp báº¡n duy trÃ¬ thÃ³i quen há»c táº­p, tÃ­ch lÅ©y Ä‘iá»ƒm kinh nghiá»‡m (XP) vÃ  ná»‘i dÃ i chuá»—i ngÃ y há»c táº­p (streak) nha.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">VÃ o phÃ²ng Lab há»c ngay</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Email gá»­i tá»± Ä‘á»™ng thÃ¢n thiá»‡n tá»« Há»c viá»‡n HÃ³a há»c Aurum ðŸ§ª</p>
      </div>
    `,
  });
};

export const sendStudyPlanHourlyReminderEmail = async (toEmail, username, planData, hourOffset = 0, lateMinutes = null) => {
  const { dailyLessonTarget } = planData;
  const safeLateMinutes = lateMinutes === null
    ? Math.max(0, Number(hourOffset) || 0) * 60
    : Math.max(0, Math.floor(Number(lateMinutes) || 0));
  const templateHourOffset = Math.floor(safeLateMinutes / 240); // Every 4 hours
  
  let subject = '';
  let greetingMsg = '';
  let mainContent = '';
  let ctaText = 'Há»c má»™t chÃºt nÃ o';
  let accentColor = '#059669'; // default green
  let emoji = 'âœ¨';

  if (templateHourOffset === 0) {
    subject = 'ðŸŒŸ Khá»Ÿi Ä‘á»™ng ngÃ y má»›i cÃ¹ng Aurum nÃ o! ðŸŒŸ';
    greetingMsg = 'ChÃ o ngÃ y má»›i nÄƒng lÆ°á»£ng!';
    mainContent = `HÃ´m nay báº¡n Ä‘Ã£ sáºµn sÃ ng khÃ¡m phÃ¡ thÃªm nhá»¯ng kiáº¿n thá»©c thÃº vá»‹ chÆ°a? HÃ£y dÃ nh má»™t chÃºt thá»i gian hÃ´m nay Ä‘á»ƒ hoÃ n thÃ nh má»¥c tiÃªu <strong>${dailyLessonTarget} bÃ i há»c</strong> nhÃ©!`;
    emoji = 'ðŸŒ±';
  } else if (templateHourOffset === 1) {
    subject = 'ðŸŽ’ Báº¡n Æ¡i, hÃ´m nay há»c má»™t chÃºt chá»©? ðŸŽ’';
    greetingMsg = 'Chá»‰ cáº§n má»™t chÃºt tiáº¿n bá»™ má»—i ngÃ y!';
    mainContent = `HÃ´m nay báº¡n váº«n chÆ°a ghÃ© thÄƒm phÃ²ng Lab cá»§a Aurum Ä‘Ã³ nha. DÃ nh ra Ã­t phÃºt hoÃ n thÃ nh má»¥c tiÃªu <strong>${dailyLessonTarget} bÃ i há»c</strong> Ä‘á»ƒ duy trÃ¬ Ä‘Ã  há»c táº­p nÃ o!`;
    accentColor = '#0d9488'; // teal
    ctaText = 'Báº¯t Ä‘áº§u há»c ngay';
    emoji = 'âš¡';
  } else if (templateHourOffset === 2) {
    subject = 'ðŸ”¥ Äá»‘t lá»­a phÃ²ng Lab Aurum cÃ¹ng nhau nÃ o! ðŸ”¥';
    greetingMsg = 'Giá»¯ vá»¯ng nhá»‹p Ä‘iá»‡u cÃ¹ng Aurum!';
    mainContent = `KiÃªn trÃ¬ lÃ  chÃ¬a khÃ³a Ä‘á»ƒ lÃ m chá»§ tháº¿ giá»›i HÃ³a há»c. GhÃ© thÄƒm Aurum Ä‘á»ƒ hoÃ n thÃ nh <strong>${dailyLessonTarget} bÃ i há»c</strong> hÃ´m nay nhÃ©. CÃ¡c nguyÃªn tá»­ Ä‘ang chá» báº¡n ghÃ©p Ä‘Ã´i Ä‘Ã³!`;
    accentColor = '#f59e0b'; // orange
    ctaText = 'Tiáº¿p tá»¥c rÃ¨n luyá»‡n';
    emoji = 'ðŸ”¬';
  } else if (templateHourOffset === 3) {
    subject = 'â° Tik tok! Äá»«ng quÃªn nhiá»‡m vá»¥ hÃ´m nay nhÃ©! â°';
    greetingMsg = 'Má»™t chÃºt ná»— lá»±c cuá»‘i ngÃ y!';
    mainContent = `DÃ¹ báº­n rá»™n Ä‘áº¿n Ä‘Ã¢u, cÅ©ng Ä‘á»«ng quÃªn tÃ­ch lÅ©y thÃªm má»™t chÃºt kiáº¿n thá»©c cho báº£n thÃ¢n nhÃ©. HoÃ n thÃ nh nhanh <strong>${dailyLessonTarget} bÃ i há»c</strong> hÃ´m nay nÃ o báº¡n Æ¡i!`;
    accentColor = '#10b981'; // mint green
    ctaText = 'KhÃ¡m phÃ¡ phÃ²ng Lab';
    emoji = 'â­';
  } else {
    subject = 'ðŸŒ™ Há»c má»™t chÃºt trÆ°á»›c khi ngá»§ nÃ o báº¡n Æ¡i! ðŸŒ™';
    greetingMsg = 'TrÆ°á»›c khi chÃ¬m vÃ o giáº¥c ngá»§ ngon...';
    mainContent = `Chá»‰ cáº§n hoÃ n thÃ nh <strong>${dailyLessonTarget} bÃ i há»c</strong> thÃ´i lÃ  báº¡n Ä‘Ã£ cÃ³ thá»ƒ yÃªn tÃ¢m nghá»‰ ngÆ¡i vá»›i má»¥c tiÃªu ngÃ y Ä‘Ã£ Ä‘áº¡t Ä‘Æ°á»£c rá»“i. Cá»‘ lÃªn má»™t chÃºt ná»¯a nhÃ©!`;
    accentColor = '#6366f1'; // indigo
    ctaText = 'HoÃ n thÃ nh ngay';
    emoji = 'ðŸ¦‰';
  }

  return sendMail({
    to: toEmail,
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; padding: 35px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <div style="text-align: center; margin-bottom: 15px;">
          <span style="font-size: 44px;">${emoji}</span>
        </div>
        <h2 style="color: ${accentColor}; text-align: center; margin-top: 10px; font-weight: 800; font-size: 20px;">${greetingMsg}</h2>
        <p>Xin chÃ o <strong>${username}</strong>,</p>
        <p>${mainContent}</p>
        
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 16px; margin: 25px 0; text-align: center; border: 1px solid #e2e8f0;">
          <span style="font-size: 15px; font-weight: bold; color: ${accentColor};">ðŸ“š Má»¥c tiÃªu hÃ´m nay cá»§a báº¡n: ${dailyLessonTarget} bÃ i há»c</span>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: ${accentColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${ctaText}</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Email gá»­i tá»± Ä‘á»™ng thÃ¢n thiá»‡n tá»« Há»c viá»‡n HÃ³a há»c Aurum ðŸ§ª</p>
      </div>
    `,
  });
};

export const sendStreakReminderEmail = async (toEmail, username, streakCount, hourOffset = 0, lateMinutes = null) => {
  const safeLateMinutes = lateMinutes === null
    ? Math.max(0, Number(hourOffset) || 0) * 60
    : Math.max(0, Math.floor(Number(lateMinutes) || 0));
  const templateHourOffset = Math.floor(safeLateMinutes / 240); // Every 4 hours

  let subject = '';
  let greetingMsg = '';
  let mainContent = '';
  let ctaText = 'Giá»¯ ngá»n lá»­a rá»±c chÃ¡y';
  let accentColor = '#ea580c'; // default orange
  let emoji = 'ðŸ”¥';

  if (templateHourOffset === 0) {
    subject = `ðŸ”¥ Ná»‘i dÃ i chuá»—i streak ${streakCount} ngÃ y cÃ¹ng Aurum! ðŸ”¥`;
    greetingMsg = 'Duy trÃ¬ phong Ä‘á»™ Ä‘á»‰nh cao cá»§a báº¡n!';
    mainContent = `ChÃ o ngÃ y má»›i! Chuá»—i há»c táº­p liÃªn tá»¥c cá»§a báº¡n Ä‘Ã£ Ä‘áº¡t **${streakCount} ngÃ y** rá»“i Ä‘Ã³. HÃ£y dÃ nh Ã­t phÃºt há»c hÃ´m nay Ä‘á»ƒ tiáº¿p tá»¥c ná»‘i dÃ i thÃ nh tÃ­ch Ä‘Ã¡ng ná»ƒ nÃ y nhÃ©!`;
    emoji = 'âœ¨';
  } else if (templateHourOffset === 1) {
    subject = `âš¡ Giá»¯ lá»­a chuá»—i ${streakCount} ngÃ y há»c táº­p cá»§a báº¡n! âš¡`;
    greetingMsg = 'Ngá»n lá»­a cá»§a báº¡n váº«n Ä‘ang chÃ¡y rá»±c!';
    mainContent = `Báº¡n Ä‘ang cÃ³ chuá»—i há»c táº­p **${streakCount} ngÃ y** cá»±c ká»³ tuyá»‡t vá»i. Äá»«ng Ä‘á»ƒ ngá»n lá»­a bá»‹ nguá»™i Ä‘i nha, chá»‰ cáº§n 1 bÃ i há»c ngáº¯n thÃ´i Ä‘á»ƒ tiáº¿p tá»¥c thÃ³i quen tá»‘t nÃ o!`;
    accentColor = '#f97316';
    emoji = 'ðŸƒâ€â™‚ï¸';
  } else if (templateHourOffset === 2) {
    subject = `ðŸƒâ€â™‚ï¸ Äá»«ng Ä‘á»ƒ chuá»—i ${streakCount} ngÃ y vá»¥t máº¥t nhÃ©! ðŸƒâ€â™‚ï¸`;
    greetingMsg = 'DÃ nh 3 phÃºt báº£o vá»‡ thÃ nh quáº£ nÃ o!';
    mainContent = `Chuá»—i **${streakCount} ngÃ y** há»c táº­p lÃ  minh chá»©ng cho sá»± kiÃªn trÃ¬ tuyá»‡t vá»i cá»§a báº¡n. CÃ¹ng ghÃ© Aurum há»c má»™t bÃ i há»c ngáº¯n Ä‘á»ƒ giá»¯ vá»¯ng chuá»—i hÃ´m nay nha!`;
    accentColor = '#eab308';
    emoji = 'ðŸ’ª';
  } else if (templateHourOffset === 3) {
    subject = `ðŸš¨ Cá»©u nguy cho chuá»—i streak ${streakCount} ngÃ y cá»§a báº¡n! ðŸš¨`;
    greetingMsg = 'Báº£o vá»‡ ngá»n lá»­a cá»§a báº¡n ngay!';
    mainContent = `HÃ´m nay sáº¯p trÃ´i qua rá»“i vÃ  chuá»—i **${streakCount} ngÃ y** há»c táº­p cá»§a báº¡n Ä‘ang gáº·p thá»­ thÃ¡ch lá»›n. ÄÄƒng nháº­p Aurum vÃ  hoÃ n thÃ nh nhanh 1 bÃ i há»c Ä‘á»ƒ báº£o toÃ n ngá»n lá»­a nhÃ©!`;
    accentColor = '#ef4444';
    ctaText = 'Báº£o vá»‡ chuá»—i streak';
    emoji = 'ðŸš¨';
  } else {
    subject = `ðŸ†˜ CÆ¡ há»™i cuá»‘i cÃ¹ng giá»¯ chuá»—i ${streakCount} ngÃ y! ðŸ†˜`;
    greetingMsg = 'Giá»¯ ngá»n lá»­a rá»±c chÃ¡y Ä‘áº¿n cÃ¹ng!';
    mainContent = `Chá»‰ cÃ²n Ã­t thá»i gian ná»¯a thÃ´i lÃ  ngÃ y hÃ´m nay sáº½ khÃ©p láº¡i rá»“i. HÃ£y dÃ nh ra 2 phÃºt hoÃ n thÃ nh nhanh 1 bÃ i há»c Ä‘á»ƒ giá»¯ láº¡i chuá»—i **${streakCount} ngÃ y** cá»±c ká»³ Ä‘Ã¡ng tá»± hÃ o cá»§a báº¡n nhÃ©. Aurum tin báº¡n lÃ m Ä‘Æ°á»£c!`;
    accentColor = '#be123c';
    ctaText = 'Giá»¯ lá»­a ngay';
    emoji = 'ðŸ¦‰';
  }

  return sendMail({
    to: toEmail,
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; padding: 35px; border: 1px solid #fee2e2; border-radius: 24px; background-color: #fffaf0; color: #1e293b; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.05);">
        <div style="text-align: center; margin-bottom: 15px;">
          <span style="font-size: 44px;">${emoji}</span>
        </div>
        <h2 style="color: ${accentColor}; text-align: center; margin-top: 10px; font-weight: 800; font-size: 20px;">${greetingMsg}</h2>
        <p>Xin chÃ o <strong>${username}</strong>,</p>
        <p>${mainContent}</p>
        
        <div style="background-color: #ffedd5; padding: 18px; border-radius: 16px; margin: 25px 0; text-align: center; border: 1px dashed #f97316;">
          <span style="font-size: 16px; font-weight: bold; color: #ea580c;">ðŸ”¥ Chuá»—i hiá»‡n táº¡i: ${streakCount} ngÃ y liÃªn tiáº¿p! ðŸ”¥</span>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: ${accentColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.2);">${ctaText}</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 30px 0;" />
        <p style="font-size: 11px; color: #a1a1aa; text-align: center; margin-bottom: 0;">Email nháº¯c nhá»Ÿ giá»¯ chuá»—i tá»± Ä‘á»™ng tá»« Há»c viá»‡n HÃ³a há»c Aurum ðŸ§ª</p>
      </div>
    `,
  });
};

export const sendTeacherApprovalEmail = async (toEmail, username, token) => {
  const loginUrl = token ? `https://chem-aurum.vercel.app/login?token=${token}` : 'https://chem-aurum.vercel.app/login';
  return sendMail({
    to: toEmail,
    subject: 'âœ… TÃ i khoáº£n giÃ¡o viÃªn Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t - Há»c viá»‡n HÃ³a há»c Aurum',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #059669; text-align: center;">Há»c viá»‡n HÃ³a há»c Aurum</h2>
        <p>Xin chÃ o <strong>${username}</strong>,</p>
        <p>ðŸŽ‰ ChÃºc má»«ng! YÃªu cáº§u Ä‘Äƒng kÃ½ tÃ i khoáº£n <strong>GiÃ¡o viÃªn</strong> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c <strong style="color: #059669;">phÃª duyá»‡t</strong>.</p>
        <p>Báº¡n cÃ³ thá»ƒ Ä‘Äƒng nháº­p vÃ o há»‡ thá»‘ng ngay bÃ¢y giá» báº±ng tÃªn Ä‘Äƒng nháº­p vÃ  máº­t kháº©u Ä‘Ã£ Ä‘Äƒng kÃ½.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${loginUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">ÄÄƒng nháº­p ngay</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">ÄÃ¢y lÃ  email tá»± Ä‘á»™ng tá»« há»‡ thá»‘ng Há»c viá»‡n HÃ³a há»c Aurum.</p>
      </div>
    `,
  });
};

export const sendTeacherRejectionEmail = async (toEmail, username, reason) => {
  return sendMail({
    to: toEmail,
    subject: 'âŒ YÃªu cáº§u Ä‘Äƒng kÃ½ giÃ¡o viÃªn khÃ´ng Ä‘Æ°á»£c duyá»‡t - Há»c viá»‡n HÃ³a há»c Aurum',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #dc2626; text-align: center;">Há»c viá»‡n HÃ³a há»c Aurum</h2>
        <p>Xin chÃ o <strong>${username}</strong>,</p>
        <p>ChÃºng tÃ´i ráº¥t tiáº¿c pháº£i thÃ´ng bÃ¡o ráº±ng yÃªu cáº§u Ä‘Äƒng kÃ½ tÃ i khoáº£n <strong>GiÃ¡o viÃªn</strong> cá»§a báº¡n Ä‘Ã£ <strong style="color: #dc2626;">khÃ´ng Ä‘Æ°á»£c cháº¥p thuáº­n</strong>.</p>
        ${reason ? `<div style="background-color: #fef2f2; padding: 15px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #dc2626;"><p style="margin: 0;"><strong>LÃ½ do:</strong> ${reason}</p></div>` : ''}
        <p>Náº¿u báº¡n cÃ³ tháº¯c máº¯c hoáº·c muá»‘n Ä‘Äƒng kÃ½ láº¡i vá»›i thÃ´ng tin bá»• sung, vui lÃ²ng liÃªn há»‡ vá»›i chÃºng tÃ´i.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">ÄÃ¢y lÃ  email tá»± Ä‘á»™ng tá»« há»‡ thá»‘ng Há»c viá»‡n HÃ³a há»c Aurum.</p>
      </div>
    `,
  });
};

