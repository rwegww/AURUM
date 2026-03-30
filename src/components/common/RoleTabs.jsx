import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = [
  {
    id: 'learner',
    title: 'Học viên',
    desc: 'Bắt đầu từ những kiến thức cơ bản nhất về nguyên tử và phân tử qua các bài giảng sinh động.',
    features: ['Hành trình khám phá', 'Huy hiệu thành tích', 'Đấu trường PK'],
    icon: '🎓'
  },
  {
    id: 'researcher',
    title: 'Nhà nghiên cứu',
    desc: 'Thực hiện các thí nghiệm phức tạp trong phòng thí nghiệm ảo và giải quyết các vấn đề thực tế.',
    features: ['Thí nghiệm nâng cao', 'Dự án nghiên cứu', 'Cộng đồng khoa học'],
    icon: '⚗️'
  },
  {
    id: 'teacher',
    title: 'Hướng dẫn viên',
    desc: 'Công cụ mạnh mẽ để quản lý lớp học, theo dõi tiến độ và tạo ra các thử thách sáng tạo cho học sinh.',
    features: ['Quản lý lớp học', 'Báo cáo thông minh', 'Thư viện giáo án'],
    icon: '👨‍🏫'
  }
];

const RoleTabs = () => {
  const [activeTab, setActiveTab] = useState('learner');
  const activeRole = roles.find(r => r.id === activeTab);

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-center gap-4">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => setActiveTab(role.id)}
            className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all border-2 ${
              activeTab === role.id 
                ? 'bg-viet-green border-viet-green text-white shadow-xl shadow-viet-green/20 scale-105' 
                : 'bg-white border-viet-border text-viet-text-light hover:border-viet-green/30 hover:text-viet-green'
            }`}
          >
            {role.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-viet-green/5 text-viet-green rounded-full font-black text-[10px] uppercase tracking-widest">
              Dành cho {activeRole.title}
            </div>
            <h3 className="text-3xl font-black text-viet-text tracking-tighter uppercase italic">
               Nâng tầm <span className="text-viet-green">trải nghiệm</span>
            </h3>
            <p className="text-lg text-viet-text-light leading-relaxed font-bold">
              {activeRole.desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeRole.features.map(f => (
                <div key={f} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-viet-border">
                  <div className="w-8 h-8 rounded-xl bg-viet-green/10 flex items-center justify-center text-viet-green">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-viet-text font-black text-[13px]">{f}</span>
                </div>
              ))}
            </div>
            <button className="viet-btn-green w-full sm:w-auto">
              Trải nghiệm ngay →
            </button>
          </div>
          
          <div className="w-full lg:w-1/3 aspect-square bg-[#fdfaf1] rounded-[48px] border-2 border-viet-border/50 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-viet-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <span className="text-9xl transition-transform group-hover:scale-110 duration-500">
                {activeRole.icon}
             </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RoleTabs;
