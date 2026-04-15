import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Beaker, 
  Swords, 
  Library, 
  Trophy, 
  Flame, 
  Settings, 
  MoreHorizontal,
  Star,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

const MASCOT_URL = "/chemistry_mascot_duo_style_1776849120851.png";

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
      active 
        ? 'bg-duo-blue/10 text-duo-blue border-2 border-duo-blue' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    }`}
  >
    <Icon size={28} strokeWidth={active ? 3 : 2} className="shrink-0" />
    <span className={`text-[15px] font-black uppercase tracking-wider hidden xl:block`}>
      {label}
    </span>
  </Link>
);

const PathNode = ({ index, title, status, icon: Icon, colorClass, shadowClass }) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  // Duo-style path offset
  const offset = [0, 40, 80, 40, 0, -40, -80, -40][index % 8];

  return (
    <div className="relative flex flex-col items-center" style={{ marginLeft: `${offset}px` }}>
      <motion.div
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        className="relative"
      >
        {isActive && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border-2 border-duo-border px-4 py-2 rounded-xl shadow-sm animate-bounce">
            <span className="text-[13px] font-black text-duo-blue uppercase tracking-widest">Bắt đầu!</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-duo-border rotate-45" />
          </div>
        )}
        
        <button 
          disabled={isLocked}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all relative border-b-8 ${
            isLocked 
              ? 'bg-gray-200 border-gray-400 text-gray-400' 
              : `${colorClass} ${shadowClass} text-white`
          }`}
        >
          {isCompleted ? <Star fill="white" size={32} /> : <Icon size={32} strokeWidth={3} />}
        </button>
      </motion.div>
      <span className={`mt-3 text-[13px] font-black uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
        {title}
      </span>
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const pathNodes = [
    { title: 'Nguyên tử', status: 'completed', icon: Star, colorClass: 'bg-[#58cc02]', shadowClass: 'border-[#46a302]' },
    { title: 'Bảng tuần hoàn', status: 'completed', icon: Star, colorClass: 'bg-[#58cc02]', shadowClass: 'border-[#46a302]' },
    { title: 'Liên kết hóa học', status: 'active', icon: Beaker, colorClass: 'bg-[#1cb0f6]', shadowClass: 'border-[#1899d6]' },
    { title: 'Phản ứng OXH', status: 'locked', icon: Lock, colorClass: 'bg-[#ffc800]', shadowClass: 'border-[#e5a400]' },
    { title: 'Kim loại kiềm', status: 'locked', icon: Lock, colorClass: 'bg-[#ffc800]', shadowClass: 'border-[#e5a400]' },
    { title: 'Halogen', status: 'locked', icon: Lock, colorClass: 'bg-[#ffc800]', shadowClass: 'border-[#e5a400]' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden md:flex flex-col w-20 xl:w-64 border-r-2 border-duo-border p-4 h-screen sticky top-0">
        <div className="px-4 py-8 mb-8">
          <h1 className="text-2xl font-black text-duo-green tracking-tighter uppercase xl:block hidden">
            Chemistry <span className="text-duo-blue">Odyssey</span>
          </h1>
          <div className="xl:hidden w-12 h-12 bg-duo-green rounded-xl flex items-center justify-center text-white font-black text-xl">C</div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem icon={HomeIcon} label="Học tập" path="/" active={location.pathname === '/'} />
          <SidebarItem icon={BookOpen} label="Lớp học" path="/classroom" />
          <SidebarItem icon={Beaker} label="Phòng Lab" path="/lab" />
          <SidebarItem icon={Swords} label="Đấu trường" path="/arena" />
          <SidebarItem icon={Library} label="Thư viện" path="/library" />
          <SidebarItem icon={Trophy} label="Bảng xếp hạng" path="/leaderboard" />
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <SidebarItem icon={Settings} label="Cài đặt" path="/settings" />
          <SidebarItem icon={MoreHorizontal} label="Thêm" path="/more" />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto">
        {/* Learning Path */}
        <div className="flex-1 px-4 py-8 md:px-8 overflow-y-auto">
          <header className="mb-12 flex items-center justify-between sticky top-0 bg-white z-10 py-4 border-b-2 border-duo-border md:hidden">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Flame size={24} fill="#ff4b4b" className="text-[#ff4b4b]" />
                  <span className="font-black text-lg text-[#ff4b4b]">5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={24} fill="#ffc800" className="text-[#ffc800]" />
                  <span className="font-black text-lg text-[#ffc800]">120</span>
                </div>
             </div>
             <img src="/logo.png" className="w-8 h-8 object-contain" />
          </header>

          <div className="max-w-md mx-auto space-y-16 pb-32">
            {pathNodes.map((node, idx) => (
              <PathNode key={idx} index={idx} {...node} />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Stats & Goals) */}
        <div className="hidden lg:block w-80 p-8 border-l-2 border-duo-border h-screen sticky top-0">
          {/* Stats Bar */}
          <div className="flex items-center justify-around mb-8 p-4 border-2 border-duo-border rounded-2xl">
            <div className="flex items-center gap-2" title="Streak">
              <Flame size={24} fill="#ff4b4b" className="text-[#ff4b4b]" />
              <span className="font-black text-lg text-[#ff4b4b]">5</span>
            </div>
            <div className="flex items-center gap-2" title="XP">
              <Star size={24} fill="#ffc800" className="text-[#ffc800]" />
              <span className="font-black text-lg text-[#ffc800]">1,240</span>
            </div>
            <div className="flex items-center gap-2" title="Gems">
              <span className="text-2xl">💎</span>
              <span className="font-black text-lg text-duo-blue">450</span>
            </div>
          </div>

          {/* Mascot Section */}
          <div className="card-tactile p-6 mb-8 relative overflow-hidden group">
            <div className="flex flex-col items-center text-center relative z-10">
              <img 
                src={MASCOT_URL} 
                alt="Beaker Bot" 
                className="w-32 h-32 object-contain mb-4 transform group-hover:scale-110 transition-transform" 
              />
              <h3 className="font-black text-lg mb-2">Xin chào, Chiến binh!</h3>
              <p className="text-gray-500 text-sm font-medium">Bạn còn 2 bài học nữa để hoàn thành mục tiêu ngày hôm nay.</p>
              <button className="mt-4 w-full py-3 btn-tactile-green font-black uppercase tracking-widest text-[13px] rounded-2xl">
                Tiếp tục ngay
              </button>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="card-tactile p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg uppercase tracking-wider">Thử thách ngày</h3>
              <Link to="/quests" className="text-duo-blue font-black text-xs uppercase hover:underline">Tất cả</Link>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Kiếm 50 XP', progress: 30, total: 50, color: 'bg-duo-yellow' },
                 { label: 'Học 2 bài mới', progress: 1, total: 2, color: 'bg-duo-green' }
               ].map((quest, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs font-black uppercase tracking-tight">
                     <span>{quest.label}</span>
                     <span>{quest.progress}/{quest.total}</span>
                   </div>
                   <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                        className={`h-full ${quest.color}`}
                     />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- Bottom Nav (Mobile) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-duo-border px-6 py-3 flex justify-between items-center z-[100]">
        <Link to="/" className="text-duo-blue"><HomeIcon size={32} strokeWidth={3} /></Link>
        <Link to="/classroom" className="text-gray-400"><BookOpen size={32} /></Link>
        <Link to="/lab" className="text-gray-400"><Beaker size={32} /></Link>
        <Link to="/arena" className="text-gray-400"><Swords size={32} /></Link>
        <Link to="/library" className="text-gray-400"><Library size={32} /></Link>
      </nav>

      <style>{`
        .btn-tactile-green {
          @apply bg-[#58cc02] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] transition-all;
        }
        .shadow-tactile {
          box-shadow: 0 4px 0 0 #e5e5e5;
        }
      `}</style>
    </div>
  );
};

export default Home;
