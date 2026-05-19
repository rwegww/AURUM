import nodemailer from 'nodemailer';

export const sendStudyPlanEmail = async (toEmail, username, planData) => {
  try {
    let transporter;

    // Use SMTP environment variables if provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: Create Ethereal test account (real-time test emails viewer)
      console.log('📝 SMTP credentials not found in env, creating Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const { studyTime, dailyLessonTarget } = planData;
    const mailOptions = {
      from: '"Học viện Hóa học Aurum" <reminders@aurum-academy.org>',
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email sent successfully:', info.messageId);
    
    // If using Ethereal, log the preview URL so developer can click it
    if (!process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`🔗 Preview URL: ${previewUrl}`);
      return { success: true, previewUrl };
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send email reminder:', error);
    return { success: false, error: error.message };
  }
};
