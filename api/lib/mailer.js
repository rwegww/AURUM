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
  } else {
    console.log('📝 SMTP credentials not found in env, creating Ethereal test account...');
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
  }
};

// Generic sendMail function (used as default export for admin.js compatibility)
const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: '"Học viện Hóa học Aurum" <no-reply@aurum-academy.org>',
      to,
      subject,
      html,
    });
    console.log('✉️ Email sent:', info.messageId);
    if (!process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`🔗 Preview URL: ${previewUrl}`);
      return { success: true, previewUrl };
    }
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

export default sendMail;

export const sendStudyPlanEmail = async (toEmail, username, planData) => {
  const { studyTime, dailyLessonTarget } = planData;
  return sendMail({
    to: toEmail,
    subject: '📚 Nhắc nhở Kế hoạch học tập - Học viện Hóa học Aurum',
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
        <p>Chúng tôi sẽ gửi email nhắc nhở bạn học tập vào lúc <strong>${studyTime}</strong> mỗi ngày để duy trì chuỗi học tập (streak) và tích lũy điểm kinh nghiệm (XP) nhé!</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://chem-aurum.vercel.app/" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Bắt đầu học ngay</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Đây là email tự động từ hệ thống Học viện Hóa học Aurum. Không cần trả lời email này.</p>
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
