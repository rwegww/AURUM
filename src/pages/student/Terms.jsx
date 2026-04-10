import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-black text-viet-text mb-6 flex items-center gap-4">
      <div className="w-2 h-8 bg-viet-green rounded-full" />
      {title}
    </h2>
    <div className="text-[15px] text-viet-text-light font-medium leading-relaxed space-y-4 px-6 border-l border-viet-border ml-1">
      {children}
    </div>
  </section>
);

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#fffbf0] pt-[180px] pb-32">
      <div className="max-w-[900px] mx-auto px-6">
        
        <header className="mb-16 text-center">
           <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-4xl md:text-5xl font-black text-viet-text mb-4"
           >
             Điều khoản & <br/> Chính sách Bảo mật
           </motion.h1>
           <p className="text-viet-text-light font-bold text-[14px] uppercase tracking-widest opacity-50">Cập nhật lần cuối: 16 tháng 04, 2026</p>
        </header>

        <div className="viet-card p-10 md:p-16 border-none shadow-2xl">
          <Section title="1. Chấp nhận điều khoản">
            <p>Bằng việc truy cập và sử dụng nền tảng Alchemix, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây.</p>
            <p>Chúng tôi có quyền cập nhật, thay đổi hoặc thay thế bất kỳ phần nào của các Điều khoản dịch vụ này bằng cách đăng bản cập nhật lên trang web của mình.</p>
          </Section>

          <Section title="2. Tài khoản người dùng">
            <p>Học viên có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.</p>
            <p>Nghiêm cấm chia sẻ tài khoản cho nhiều người sử dụng hoặc sử dụng các công cụ can thiệp vào kết quả học tập tại Đấu trường.</p>
          </Section>

          <Section title="3. Quyền sở hữu trí tuệ">
            <p>Tất cả nội dung bài giảng, hình ảnh mô phỏng 3D và mã nguồn trên nền tảng thuộc sở hữu độc quyền của Học viện KTH.</p>
            <p>Mọi hành vi sao chép, phân phối hoặc sử dụng nội dung cho mục đích thương mại mà không có sự đồng ý bằng văn bản đều bị nghiêm cấm.</p>
          </Section>

          <Section title="4. Chính sách bảo mật">
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của người học. Dữ liệu của bạn được mã hóa và lưu trữ an toàn trên hệ thống Supabase/Firebase.</p>
            <p>Chúng tôi chỉ sử dụng email của bạn để gửi thông báo học tập và khôi phục mật khẩu.</p>
          </Section>

          <Section title="5. Giới hạn trách nhiệm">
            <p>Các mô phỏng phòng thí nghiệm được thiết kế cho mục đích giáo dục trực quan. Các kết quả có thể có sai số nhỏ so với thực tế tùy thuộc vào môi trường mô phỏng.</p>
            <p>Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc sử dụng sai thông tin trên nền tảng này.</p>
          </Section>

          <div className="mt-20 pt-10 border-t border-viet-border text-center">
             <p className="text-[14px] text-viet-text-light/50 font-medium">Bạn có câu hỏi về điều khoản? <br/> Vui lòng <a href="/contact" className="text-viet-green font-bold hover:underline">Liên hệ với chúng tôi</a>.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;
