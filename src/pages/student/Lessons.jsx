import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const storyParts = {
  8: { 
    id: 1, 
    title: "Phần 1", 
    name: "Sự Khởi Đầu Thức Tỉnh", 
    story: "Bước vào thế giới phân tử nguyên sơ, nơi vạn vật bắt đầu. Nhiệm vụ của bạn là hiểu được bản chất của nguyên tử và làm chủ ngôn ngữ vô hình của Hóa học." 
  },
  9: { 
    id: 2, 
    title: "Phần 2", 
    name: "Hành Trình Chuyển Hóa", 
    story: "Những phản ứng bùng nổ và các chất biến đổi không ngừng. Mở khóa bí mật của phản ứng hóa học và nắm bắt sức mạnh từ sự tương tác giữa các nguyên tố." 
  },
  10: { 
    id: 3, 
    title: "Phần 3", 
    name: "Bước Nhảy Vĩ Mô", 
    story: "Tiến sâu vào động lực học và cấu trúc bảng tuần hoàn. Bạn sẽ phải làm quen với sự cân bằng, nhiệt lượng và động lượng chi phối toàn bộ vũ trụ vật chất." 
  },
  11: { 
    id: 4, 
    title: "Phần 4", 
    name: "Ma Trận Hữu Cơ", 
    story: "Lạc vào mê cung của các nguyên tử Carbon. Nơi đây, sự sống hình thành từ những mạch phức tạp và bí ẩn. Bạn phải tìm ra quy luật kiến tạo nên mọi sự sống." 
  },
  12: { 
    id: 5, 
    title: "Phần 5", 
    name: "Chạm Đỉnh Tiến Hóa", 
    story: "Ranh giới cuối cùng của các bậc thầy giả kim. Vượt qua những thử thách điện hóa, khám phá nguyên liệu polyme và sự dung hợp để hoàn thành định mệnh sáng tạo vũ trụ mới." 
  },
};

const Lessons = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/lessons/8/hoa8_kntt_bai1');
    }
  }, [isLoggedIn, navigate]);

  const fetchLessons = async (grade) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons?classId=${grade}`);
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error('Lỗi tải bài học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGrade) {
      fetchLessons(selectedGrade);
    }
  }, [selectedGrade]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-viet-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-viet-text mb-4 tracking-tight uppercase italic">
            {isLoggedIn ? "Hành Trình" : "Thư Viện"} <span className="text-viet-green">{isLoggedIn ? "Khám Phá" : "Học Liệu"}</span>
          </h1>
          <p className="text-viet-text-light text-lg max-w-2xl mx-auto font-medium">
            {isLoggedIn 
              ? "Hoàn thành các cốt truyện để trở thành bậc thầy giả kim thực thụ."
              : "Hành trình chinh phục tri thức Hóa học từ cơ bản đến chuyên sâu dành cho học sinh lớp 8 - 12."}
          </p>
        </header>

        {/* Grade Selection - Unified VietEdu Style */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 p-2 bg-white/50 backdrop-blur rounded-[30px] border border-viet-border max-w-fit mx-auto shadow-sm">
          {[8, 9, 10, 11, 12].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-10 py-4 rounded-[24px] font-bold transition-all duration-300 ${
                selectedGrade === grade
                  ? 'bg-viet-green text-white shadow-xl shadow-viet-green/20 scale-105'
                  : 'bg-transparent text-viet-text-light hover:text-viet-green hover:bg-white'
              }`}
            >
              {isLoggedIn ? storyParts[grade].title : `Lớp ${grade}`}
            </button>
          ))}
        </div>

        {/* Story Intro if Logged In */}
        {selectedGrade && isLoggedIn && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center bg-white border border-viet-green/20 rounded-[30px] p-10 max-w-4xl mx-auto shadow-xl shadow-viet-green/5"
          >
            <h2 className="text-3xl font-bold text-viet-green mb-4">{storyParts[selectedGrade].name}</h2>
            <p className="text-viet-text-light text-lg italic leading-relaxed font-serif">
              "{storyParts[selectedGrade].story}"
            </p>
          </motion.div>
        )}

        {/* Lesson List */}
        {selectedGrade ? (
          loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mb-4"></div>
              <p className="text-viet-text-light font-bold">Đang tải bài học...</p>
            </div>
          ) : (
            <motion.div
              key={selectedGrade}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {lessons.map((lesson, index) => (
                <motion.div key={lesson.lessonId} variants={itemVariants}>
                  <Link
                    to={`/lessons/${selectedGrade}/${lesson.lessonId}`}
                    className="viet-card p-8 group h-full hover:border-viet-green/40 transition-all duration-300 relative !rounded-[32px] !shadow-lg hover:!shadow-2xl hover:!shadow-viet-green/10 hover:-translate-y-2 bg-white"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <span className="text-8xl font-black text-viet-text leading-none">{index + 1}</span>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-viet-text mb-3 group-hover:text-viet-green transition-colors leading-tight">
                        {lesson.title}
                      </h3>
                      <p className="text-viet-text-light text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-2 text-viet-green font-bold text-[11px] uppercase tracking-widest border-t border-viet-border pt-4">
                        <span className="w-2 h-2 rounded-full bg-viet-green shadow-[0_0_10px_rgba(118,192,52,0.5)]" />
                        KHÁM PHÁ NGAY
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <div className="text-center py-24 border-4 border-dashed border-viet-border rounded-[40px] bg-white/30">
            <div className="text-7xl mb-8 opacity-20 filter grayscale">🧪</div>
            <h2 className="text-2xl font-bold text-viet-text-light">
              {isLoggedIn ? "Vui lòng chọn một phần để bắt đầu hành trình" : "Vui lòng chọn khối lớp để hiển thị bài học"}
            </h2>
            <p className="mt-2 text-viet-text-light/60 font-medium">Khám phá thế giới hóa học nhiệm màu ngay bây giờ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
