import React from 'react';
import Hero from '@/components/common/Hero';
import FeatureCards from '@/components/common/FeatureCards';
import CategoryFilter from '@/components/common/CategoryFilter';
import RoleTabs from '@/components/common/RoleTabs';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { isLoggedIn } = useAuth();
  const lessonPath = isLoggedIn ? "/lessons/8/hoa8_kntt_bai1" : "/lessons";

  return (
    <div className="min-h-screen bg-viet-bg pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCards 
            title="BÀI HỌC" 
            desc="Lộ trình học hóa từ lớp 8 đến 12" 
            icon="📚" 
            color="bg-viet-green"
            link={lessonPath}
          />
          <FeatureCards 
            title="BẢNG TUẦN HOÀN" 
            desc="Khám phá chi tiết các nguyên tố" 
            icon="📊" 
            color="bg-orange-500"
            link="/periodic-table"
          />
          <FeatureCards 
            title="PHÒNG LAB" 
            desc="Mô phỏng phản ứng & mô hình 2D" 
            icon="⚗️" 
            color="bg-blue-500"
            link="/lab"
          />
          <FeatureCards 
            title="ĐẤU TRƯỜNG" 
            desc="Thử thách kiến thức cùng bạn bè" 
            icon="🤺" 
            color="bg-purple-500"
            link="/arena"
          />
        </div>

        <div className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black text-viet-text italic tracking-tighter uppercase mb-2">
                Chương trình <span className="text-viet-green">Học tập</span>
              </h3>
              <p className="text-viet-text-light font-bold">Khám phá vũ trụ hóa học theo từng cấp lớp</p>
            </div>
            <CategoryFilter />
          </div>
          
          <RoleTabs />
        </div>
      </div>
    </div>
  );
};

export default Home;
