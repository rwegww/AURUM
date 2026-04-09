import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const labModules = [
  { 
    id: 'reaction', 
    label: 'Mô phỏng phản ứng', 
    icon: '⚗️', 
    desc: 'Chọn hóa chất và thực hiện các phản ứng hóa học trực quan.',
    path: '/lab/simulator',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'balance', 
    label: 'Cân bằng phương trình', 
    icon: '⚖️', 
    desc: 'Rèn luyện kỹ năng cân bằng PTHH với hàng nghìn bài tập.',
    path: '/lab/balancer',
    color: 'from-amber-500 to-amber-600'
  },
  { 
    id: 'molecule', 
    label: 'Mô hình phân tử', 
    icon: '🔬', 
    desc: 'Xem cấu trúc phân tử 3D và không gian của các chất hóa học.',
    path: '/lab/molecules',
    color: 'from-emerald-500 to-emerald-600'
  },
];

const ChemLab = () => {
  return (
    <div className="min-h-screen bg-[#fffbf0] pb-24 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1.5 bg-viet-green/10 rounded-full mb-6">
            <span className="text-viet-green font-black text-xs uppercase tracking-widest italic">
              Trung tâm thí nghiệm ảo
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-viet-text italic tracking-tighter uppercase mb-6 leading-tight">
            Khám phá thế giới <br /> 
            <span className="text-viet-green underline decoration-8 underline-offset-8">Hóa học</span> kỳ diệu
          </h1>
          <p className="text-viet-text-light font-bold text-lg max-w-2xl mx-auto">
            Lựa chọn mô-đun học tập và bắt đầu hành trình chinh phục tri thức của bạn ngay hôm nay.
          </p>
        </motion.div>

        {/* Module Selection Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {labModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={module.path}
                className="group relative flex flex-col h-full bg-white rounded-3xl border-2 border-viet-border hover:border-viet-green transition-all duration-500 hover:shadow-2xl hover:shadow-viet-green/10 hover:-translate-y-2 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`h-2 w-full bg-gradient-to-r ${module.color}`}></div>
                
                <div className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-viet-bg border-2 border-viet-border flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    {module.icon}
                  </div>
                  
                  <h3 className="text-2xl font-black text-viet-text italic tracking-tighter uppercase mb-4 group-hover:text-viet-green transition-colors">
                    {module.label}
                  </h3>
                  
                  <p className="text-viet-text-light font-bold text-sm leading-relaxed mb-8 flex-grow">
                    {module.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-viet-green font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Bắt đầu ngay <span>→</span>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-6 -right-6 text-8xl opacity-[0.03] group-hover:opacity-[0.06] transition-opacity font-black">
                  {module.icon}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats/Footer Decoration */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 p-8 rounded-[40px] bg-viet-text border border-white/10 text-center relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-viet-green mb-1">3,000+</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Hóa chất mô phỏng</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-viet-green mb-1">10,000+</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Phản ứng khám phá</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-white mb-1">∞</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Khả năng sáng tạo</p>
            </div>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-viet-green/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-viet-green/5 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChemLab;
