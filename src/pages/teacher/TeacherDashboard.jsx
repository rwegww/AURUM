import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ClassCard = ({ className, id, grade, students, avgScore, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-[32px] border border-viet-border p-6 hover:shadow-md hover:border-viet-green/30 transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-bold text-viet-text group-hover:text-viet-green transition-colors">{className}</h3>
        <p className="text-xs font-bold text-viet-text-light uppercase tracking-wider">Hóa học Khối {grade}</p>
      </div>
      <div className="w-10 h-10 rounded-2xl bg-viet-green/10 text-viet-green flex items-center justify-center font-black">
        {grade}
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-viet-text-light font-medium">Sĩ số:</span>
        <span className="font-bold text-viet-text">{students} Học sinh</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-viet-text-light font-medium">Trung bình XP:</span>
        <span className="font-bold text-blue-500">{avgScore} XP</span>
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-viet-border flex justify-between items-center">
      <div className="flex -space-x-2">
         {[1, 2, 3].map(i => (
           <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
         ))}
         <div className="w-8 h-8 rounded-full border-2 border-white bg-viet-bg flex items-center justify-center text-[10px] font-bold text-viet-text-light">
           +{students}
         </div>
      </div>
      <Link to={`/teacher/classes/${id}`} className="text-xs font-bold text-viet-green hover:underline">
        Quản lý ➔
      </Link>
    </div>
  </motion.div>
);

const TeacherDashboard = () => {
  const [classes, setClasses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/classes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-viet-text tracking-tight mb-2">
             🏫 Bảng Tóm Tắt Giáo Viên
          </h1>
          <p className="text-viet-text-light font-medium">Quản lý lớp học, theo dõi tiến độ và giao nhiệm vụ cho học sinh.</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-viet-green/20 to-viet-green/5 p-6 rounded-[32px] border border-viet-green/20">
             <span className="text-xs font-bold text-viet-green uppercase tracking-wider mb-2 block">Tổng số lớp</span>
             <h2 className="text-4xl font-black text-viet-text">{loading ? '...' : classes.length}</h2>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-6 rounded-[32px] border border-blue-500/20">
             <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">Tổng số học sinh</span>
             <h2 className="text-4xl font-black text-viet-text">--</h2>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-6 rounded-[32px] border border-purple-500/20">
             <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 block">Nhiệm vụ đang diễn ra</span>
             <h2 className="text-4xl font-black text-viet-text">--</h2>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-viet-text">Danh sách Lớp học</h2>
           <Link to="/teacher/classes" className="px-4 py-2 bg-viet-text text-white rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors">
              Quản lý Lớp học ➔
           </Link>
        </div>

        {/* Class List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading ? (
             <div className="col-span-full py-10 text-center"><div className="w-8 h-8 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mx-auto"></div></div>
           ) : classes.length === 0 ? (
             <div className="col-span-full py-10 text-center text-viet-text-light font-bold border-2 border-dashed border-viet-border rounded-xl">Chưa có lớp nào được tạo.</div>
           ) : (
             classes.map((cls, i) => (
               <ClassCard 
                 key={cls.id}
                 className={cls.name} 
                 id={cls.id}
                 grade={cls.grade_level} 
                 students={0} 
                 avgScore={0} 
                 delay={i * 0.1} 
               />
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
