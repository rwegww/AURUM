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
    subject: '🌱 Kế hoạch học tập của bạn đã sẵn sàng! - Học viện Aurum',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; padding: 35px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <div style="text-align: center; margin-bottom: 15px;">
          <span style="font-size: 44px;">🎒</span>
        </div>
        <h2 style="color: #059669; text-align: center; margin-top: 10px; font-weight: 800; font-size: 22px;">Chào mừng bạn tham gia kế hoạch học tập!</h2>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>Kế hoạch học tập của bạn đã được kích hoạt thành công. Chúng mình sẽ đồng hành cùng bạn trên con đường làm chủ kiến thức Hóa học nhé! ✨</p>
        
        <div style="background-color: #f0fdf4; padding: 18px; border-radius: 16px; margin: 25px 0; border: 1px solid #bbf7d0; text-align: center;">
          <span style="font-size: 15px; font-weight: bold; color: #166534;">📚 Mục tiêu của bạn: ${dailyLessonTarget} bài học mỗi ngày</span>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Hằng ngày, nếu bạn chưa hoàn thành mục tiêu học tập của ngày đó, hệ thống sẽ gửi một email nhắc nhở nhẹ nhàng để giúp bạn duy trì thói quen học tập, tích lũy điểm kinh nghiệm (XP) và nối dài chuỗi ngày học tập (streak) nha.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">Vào phòng Lab học ngay</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Email gửi tự động thân thiện từ Học viện Hóa học Aurum 🧪</p>
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
  let ctaText = 'Học một chút nào';
  let accentColor = '#059669'; // default green
  let emoji = '✨';

  if (templateHourOffset === 0) {
    subject = '🌟 Khởi động ngày mới cùng Aurum nào! 🌟';
    greetingMsg = 'Chào ngày mới năng lượng!';
    mainContent = `Hôm nay bạn đã sẵn sàng khám phá thêm những kiến thức thú vị chưa? Hãy dành một chút thời gian hôm nay để hoàn thành mục tiêu <strong>${dailyLessonTarget} bài học</strong> nhé!`;
    emoji = '🌱';
  } else if (templateHourOffset === 1) {
    subject = '🎒 Bạn ơi, hôm nay học một chút chứ? 🎒';
    greetingMsg = 'Chỉ cần một chút tiến bộ mỗi ngày!';
    mainContent = `Hôm nay bạn vẫn chưa ghé thăm phòng Lab của Aurum đó nha. Dành ra ít phút hoàn thành mục tiêu <strong>${dailyLessonTarget} bài học</strong> để duy trì đà học tập nào!`;
    accentColor = '#0d9488'; // teal
    ctaText = 'Bắt đầu học ngay';
    emoji = '⚡';
  } else if (templateHourOffset === 2) {
    subject = '🔥 Đốt lửa phòng Lab Aurum cùng nhau nào! 🔥';
    greetingMsg = 'Giữ vững nhịp điệu cùng Aurum!';
    mainContent = `Kiên trì là chìa khóa để làm chủ thế giới Hóa học. Ghé thăm Aurum để hoàn thành <strong>${dailyLessonTarget} bài học</strong> hôm nay nhé. Các nguyên tử đang chờ bạn ghép đôi đó!`;
    accentColor = '#f59e0b'; // orange
    ctaText = 'Tiếp tục rèn luyện';
    emoji = '🔬';
  } else if (templateHourOffset === 3) {
    subject = '⏰ Tik tok! Đừng quên nhiệm vụ hôm nay nhé! ⏰';
    greetingMsg = 'Một chút nỗ lực cuối ngày!';
    mainContent = `Dù bận rộn đến đâu, cũng đừng quên tích lũy thêm một chút kiến thức cho bản thân nhé. Hoàn thành nhanh <strong>${dailyLessonTarget} bài học</strong> hôm nay nào bạn ơi!`;
    accentColor = '#10b981'; // mint green
    ctaText = 'Khám phá phòng Lab';
    emoji = '⭐';
  } else {
    subject = '🌙 Học một chút trước khi ngủ nào bạn ơi! 🌙';
    greetingMsg = 'Trước khi chìm vào giấc ngủ ngon...';
    mainContent = `Chỉ cần hoàn thành <strong>${dailyLessonTarget} bài học</strong> thôi là bạn đã có thể yên tâm nghỉ ngơi với mục tiêu ngày đã đạt được rồi. Cố lên một chút nữa nhé!`;
    accentColor = '#6366f1'; // indigo
    ctaText = 'Hoàn thành ngay';
    emoji = '🦉';
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
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>${mainContent}</p>
        
        <div style="background-color: #f8fafc; padding: 18px; border-radius: 16px; margin: 25px 0; text-align: center; border: 1px solid #e2e8f0;">
          <span style="font-size: 15px; font-weight: bold; color: ${accentColor};">📚 Mục tiêu hôm nay của bạn: ${dailyLessonTarget} bài học</span>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: ${accentColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${ctaText}</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Email gửi tự động thân thiện từ Học viện Hóa học Aurum 🧪</p>
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
  let ctaText = 'Giữ ngọn lửa rực cháy';
  let accentColor = '#ea580c'; // default orange
  let emoji = '🔥';

  if (templateHourOffset === 0) {
    subject = `🔥 Nối dài chuỗi streak ${streakCount} ngày cùng Aurum! 🔥`;
    greetingMsg = 'Duy trì phong độ đỉnh cao của bạn!';
    mainContent = `Chào ngày mới! Chuỗi học tập liên tục của bạn đã đạt **${streakCount} ngày** rồi đó. Hãy dành ít phút học hôm nay để tiếp tục nối dài thành tích đáng nể này nhé!`;
    emoji = '✨';
  } else if (templateHourOffset === 1) {
    subject = `⚡ Giữ lửa chuỗi ${streakCount} ngày học tập của bạn! ⚡`;
    greetingMsg = 'Ngọn lửa của bạn vẫn đang cháy rực!';
    mainContent = `Bạn đang có chuỗi học tập **${streakCount} ngày** cực kỳ tuyệt vời. Đừng để ngọn lửa bị nguội đi nha, chỉ cần 1 bài học ngắn thôi để tiếp tục thói quen tốt nào!`;
    accentColor = '#f97316';
    emoji = '🏃‍♂️';
  } else if (templateHourOffset === 2) {
    subject = `🏃‍♂️ Đừng để chuỗi ${streakCount} ngày vụt mất nhé! 🏃‍♂️`;
    greetingMsg = 'Dành 3 phút bảo vệ thành quả nào!';
    mainContent = `Chuỗi **${streakCount} ngày** học tập là minh chứng cho sự kiên trì tuyệt vời của bạn. Cùng ghé Aurum học một bài học ngắn để giữ vững chuỗi hôm nay nha!`;
    accentColor = '#eab308';
    emoji = '💪';
  } else if (templateHourOffset === 3) {
    subject = `🚨 Cứu nguy cho chuỗi streak ${streakCount} ngày của bạn! 🚨`;
    greetingMsg = 'Bảo vệ ngọn lửa của bạn ngay!';
    mainContent = `Hôm nay sắp trôi qua rồi và chuỗi **${streakCount} ngày** học tập của bạn đang gặp thử thách lớn. Đăng nhập Aurum và hoàn thành nhanh 1 bài học để bảo toàn ngọn lửa nhé!`;
    accentColor = '#ef4444';
    ctaText = 'Bảo vệ chuỗi streak';
    emoji = '🚨';
  } else {
    subject = `🆘 Cơ hội cuối cùng giữ chuỗi ${streakCount} ngày! 🆘`;
    greetingMsg = 'Giữ ngọn lửa rực cháy đến cùng!';
    mainContent = `Chỉ còn ít thời gian nữa thôi là ngày hôm nay sẽ khép lại rồi. Hãy dành ra 2 phút hoàn thành nhanh 1 bài học để giữ lại chuỗi **${streakCount} ngày** cực kỳ đáng tự hào của bạn nhé. Aurum tin bạn làm được!`;
    accentColor = '#be123c';
    ctaText = 'Giữ lửa ngay';
    emoji = '🦉';
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
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>${mainContent}</p>
        
        <div style="background-color: #ffedd5; padding: 18px; border-radius: 16px; margin: 25px 0; text-align: center; border: 1px dashed #f97316;">
          <span style="font-size: 16px; font-weight: bold; color: #ea580c;">🔥 Chuỗi hiện tại: ${streakCount} ngày liên tiếp! 🔥</span>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: ${accentColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.2);">${ctaText}</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 30px 0;" />
        <p style="font-size: 11px; color: #a1a1aa; text-align: center; margin-bottom: 0;">Email nhắc nhở giữ chuỗi tự động từ Học viện Hóa học Aurum 🧪</p>
      </div>
    `,
  });
};

export const sendTeacherApprovalEmail = async (toEmail, username, token) => {
  const loginUrl = token ? `https://chem-aurum.vercel.app/login?token=${token}` : 'https://chem-aurum.vercel.app/login';
  return sendMail({
    to: toEmail,
    subject: '✅ Tài khoản giáo viên đã được duyệt - Học viện Hóa học Aurum',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #059669; text-align: center;">Học viện Hóa học Aurum</h2>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>🎉 Chúc mừng! Yêu cầu đăng ký tài khoản <strong>Giáo viên</strong> của bạn đã được <strong style="color: #059669;">phê duyệt</strong>.</p>
        <p>Bạn có thể đăng nhập vào hệ thống ngay bây giờ bằng tên đăng nhập và mật khẩu đã đăng ký.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${loginUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Đăng nhập ngay</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Đây là email tự động từ hệ thống Học viện Hóa học Aurum.</p>
      </div>
    `,
  });
};

export const sendTeacherRejectionEmail = async (toEmail, username, reason) => {
  return sendMail({
    to: toEmail,
    subject: '❌ Yêu cầu đăng ký giáo viên không được duyệt - Học viện Hóa học Aurum',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #dc2626; text-align: center;">Học viện Hóa học Aurum</h2>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>Chúng tôi rất tiếc phải thông báo rằng yêu cầu đăng ký tài khoản <strong>Giáo viên</strong> của bạn đã <strong style="color: #dc2626;">không được chấp thuận</strong>.</p>
        ${reason ? `<div style="background-color: #fef2f2; padding: 15px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #dc2626;"><p style="margin: 0;"><strong>Lý do:</strong> ${reason}</p></div>` : ''}
        <p>Nếu bạn có thắc mắc hoặc muốn đăng ký lại với thông tin bổ sung, vui lòng liên hệ với chúng tôi.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Đây là email tự động từ hệ thống Học viện Hóa học Aurum.</p>
      </div>
    `,
  });
};
