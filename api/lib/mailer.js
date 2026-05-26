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

const formatLateDuration = (lateMinutes) => {
  const safeLateMinutes = Number.isFinite(Number(lateMinutes))
    ? Math.max(0, Math.floor(Number(lateMinutes)))
    : 0;

  if (safeLateMinutes === 0) return 'Đúng giờ';
  if (safeLateMinutes < 60) return `Trễ ${safeLateMinutes} phút`;

  const hours = Math.floor(safeLateMinutes / 60);
  const minutes = safeLateMinutes % 60;
  return minutes > 0
    ? `Trễ ${hours} giờ ${minutes} phút`
    : `Trễ ${hours} giờ`;
};

export const sendStudyPlanConfirmationEmail = async (toEmail, username, planData) => {
  const { studyTime, dailyLessonTarget } = planData;
  return sendMail({
    to: toEmail,
    subject: '✔️ Xác nhận kích hoạt Kế hoạch học tập - Học viện Hóa học Aurum',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #059669; text-align: center;">Học viện Hóa học Aurum</h2>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>Kế hoạch học tập của bạn đã được thiết lập thành công và kích hoạt nhắc nhở!</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Chi tiết kế hoạch:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li>⏰ <strong>Giờ học dự kiến:</strong> ${studyTime}</li>
            <li>📚 <strong>Mục tiêu hàng ngày:</strong> ${dailyLessonTarget} bài học</li>
          </ul>
        </div>
        <p>Hệ thống sẽ gửi email nhắc nhở bạn học tập vào lúc <strong>${studyTime}</strong> mỗi ngày (nếu bạn chưa hoàn thành mục tiêu học tập trong ngày) để duy trì chuỗi học tập (streak) và tích lũy điểm kinh nghiệm (XP) nhé!</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Bắt đầu học ngay</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Đây là email tự động từ hệ thống Học viện Hóa học Aurum. Không cần trả lời email này.</p>
      </div>
    `,
  });
};

export const sendStudyPlanHourlyReminderEmail = async (toEmail, username, planData, hourOffset = 0, lateMinutes = null) => {
  const { studyTime, dailyLessonTarget } = planData;
  const safeLateMinutes = lateMinutes === null
    ? Math.max(0, Number(hourOffset) || 0) * 60
    : Math.max(0, Math.floor(Number(lateMinutes) || 0));
  const templateHourOffset = Math.floor(safeLateMinutes / 240); // Every 4 hours
  const lateDurationText = formatLateDuration(safeLateMinutes);
  
  let subject = '';
  let greetingMsg = '';
  let mainContent = '';
  let ctaText = 'Vào học ngay';
  let accentColor = '#059669'; // default green

  if (templateHourOffset === 0) {
    subject = '📚 Hành trình hôm nay vừa bắt đầu! - Học viện Aurum';
    greetingMsg = 'Ngày mới năng lượng!';
    mainContent = `Hãy dành một chút thời gian hôm nay để hoàn thành mục tiêu học tập hàng ngày (<strong>${dailyLessonTarget} bài học</strong>). Chúc bạn một ngày học tập hiệu quả!`;
  } else if (templateHourOffset === 1) {
    subject = '⚡ Đừng quên mục tiêu học tập nhé! - Học viện Aurum';
    greetingMsg = 'Bạn đã bỏ lỡ 4 tiếng trôi qua!';
    mainContent = `Chỉ cần hoàn thành <strong>${dailyLessonTarget} bài học</strong> để tiếp tục tích lũy kinh nghiệm (XP) và nâng cao trình độ. Hãy bứt phá ngay nhé!`;
    accentColor = '#0d9488'; // teal
    ctaText = 'Bắt đầu học ngay';
  } else if (templateHourOffset === 2) {
    subject = '🔥 Giữ ngọn lửa học tập của bạn! - Học viện Aurum';
    greetingMsg = 'Đã 8 tiếng trôi qua, hãy giữ vững sự kiên trì!';
    mainContent = `Sự kiên trì hàng ngày là chìa khóa để làm chủ kiến thức Hóa học. Hãy dành ra ít phút hoàn thành <strong>${dailyLessonTarget} bài học</strong> của ngày hôm nay nhé!`;
    accentColor = '#f59e0b'; // orange
    ctaText = 'Tiếp tục rèn luyện';
  } else if (templateHourOffset === 3) {
    subject = '⏱️ Nửa ngày đã trôi qua! - Học viện Aurum';
    greetingMsg = '12 tiếng đã trôi qua, đừng để mục tiêu hôm nay bị bỏ lỡ!';
    mainContent = `Phòng thí nghiệm Aurum với các thử thách hóa học thú vị đang chờ đón bạn. Hoàn thành ngay <strong>${dailyLessonTarget} bài học</strong> để nhận thêm XP thưởng nào!`;
    accentColor = '#ef4444'; // red
    ctaText = 'Khám phá phòng Lab';
  } else {
    subject = '🧪 Cuối ngày rồi, nỗ lực thêm chút nữa nào! - Học viện Aurum';
    greetingMsg = 'Gần hết ngày rồi, cố lên bạn nhé!';
    mainContent = `Đừng kết thúc ngày hôm nay mà chưa đạt được mục tiêu học tập. Hãy đăng nhập và hoàn thành <strong>${dailyLessonTarget} bài học</strong> ngay!`;
    accentColor = '#8b5cf6'; // purple
    ctaText = 'Hoàn thành ngay';
  }

  return sendMail({
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #059669; text-align: center;">Học viện Hóa học Aurum</h2>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p style="font-size: 16px; font-weight: bold; color: ${accentColor};">🔔 ${greetingMsg}</p>
        <p>${mainContent}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${accentColor};">
          <ul style="list-style-type: none; padding-left: 0; margin: 0;">
            <li>⏰ <strong>Giờ hẹn học:</strong> ${studyTime}</li>
            <li>📚 <strong>Mục tiêu:</strong> ${dailyLessonTarget} bài học</li>
            <li>&#128338; <strong>Thời gian trôi qua:</strong> ${lateDurationText}</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: ${accentColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">${ctaText}</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Đây là email tự động từ hệ thống Học viện Hóa học Aurum. Không cần trả lời email này.</p>
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
  let ctaText = 'Vào học ngay';
  let accentColor = '#ea580c'; // default orange

  if (templateHourOffset === 0) {
    subject = `🔥 Bảo vệ chuỗi ${streakCount} ngày của bạn! - Học viện Aurum`;
    greetingMsg = `Ngày mới bắt đầu, hãy tiếp tục nối dài chuỗi ${streakCount} ngày nhé!`;
    mainContent = 'Đừng quên hoàn thành bài học hôm nay để không đánh mất chuỗi học tập tuyệt vời của bạn.';
  } else if (templateHourOffset === 1) {
    subject = `⚡ Chuỗi ${streakCount} ngày đang chờ bạn! - Học viện Aurum`;
    greetingMsg = 'Đã 4 tiếng trôi qua, ngọn lửa của bạn vẫn đang cháy!';
    mainContent = 'Chỉ cần một bài học nữa thôi để giữ lửa, đừng chần chừ nhé!';
  } else if (templateHourOffset === 2) {
    subject = `⏳ Giữ vững chuỗi ${streakCount} ngày! - Học viện Aurum`;
    greetingMsg = 'Đã 8 tiếng trôi qua, đừng để chuỗi bị gián đoạn!';
    mainContent = 'Chuỗi học tập thể hiện sự kiên trì của bạn. Hãy vào học ngay để chứng minh bản lĩnh!';
    accentColor = '#ef4444'; // red
  } else if (templateHourOffset === 3) {
    subject = `🚨 Báo động: Chuỗi ${streakCount} ngày sắp mất! - Học viện Aurum`;
    greetingMsg = '12 tiếng đã trôi qua, nguy cơ mất chuỗi đang đến gần!';
    mainContent = 'Bạn đã nỗ lực rất nhiều để đạt được thành tích này. Đừng bỏ cuộc bây giờ!';
    accentColor = '#dc2626'; // darker red
    ctaText = 'Cứu chuỗi ngay';
  } else {
    subject = `🆘 Cảnh báo khẩn cấp: Chuỗi ${streakCount} ngày đang kêu cứu! - Học viện Aurum`;
    greetingMsg = 'Ngày sắp hết, ngọn lửa của bạn sắp tắt!';
    mainContent = 'Còn vài tiếng nữa thôi! Hãy hoàn thành bài học ngay lập tức để giữ vững thành quả của bạn!';
    accentColor = '#b91c1c'; // darkest red
    ctaText = 'Giữ ngọn lửa rực cháy';
  }

  return sendMail({
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 16px; background-color: #fffaf0;">
        <h2 style="color: #dc2626; text-align: center; margin-bottom: 5px;">🔥 Học viện Hóa học Aurum</h2>
        <div style="text-align: center; font-size: 48px; margin: 15px 0;">⚡🏃💨</div>
        <p>Xin chào <strong>${username}</strong>,</p>
        <p style="font-size: 16px; font-weight: bold; color: ${accentColor}; text-align: center;">🔔 ${greetingMsg}</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Cảnh báo! Chuỗi học tập liên tục cực kỳ ấn tượng của bạn đã đạt tới <strong style="color: #ea580c; font-size: 20px;">${streakCount} ngày</strong>.
        </p>
        <p style="font-size: 15px; color: #475569;">
          ${mainContent}
        </p>
        <div style="background-color: #ffedd5; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px dashed #f97316; text-align: center;">
          <span style="font-size: 18px; font-weight: bold; color: #ea580c;">🔥 Giữ ngọn lửa rực cháy - Thêm 1 ngày học tập! 🔥</span>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: ${accentColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.4);">${ctaText}</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #fee2e2; margin-top: 40px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">Email tự động nhắc nhở bảo vệ chuỗi học tập từ Học viện Aurum. Hãy cùng duy trì thói quen học tập tốt mỗi ngày!</p>
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
