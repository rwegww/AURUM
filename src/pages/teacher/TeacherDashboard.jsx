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

// Abstract Icons for a more mature look
const IconClass = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18M3 10h18M5 10V5a2 2 0 012-2h10a2 2 0 012 2v5M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconStudents = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTasks = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TeacherDashboard = () => {
  const [classes, setClasses] = React.useState([]);
  const [summary, setSummary] = React.useState({ total_students: 0, active_assignments: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch Classes
        const resClasses = await fetch('/api/classes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resClasses.ok) {
          const data = await resClasses.json();
          setClasses(data);
        }

        // Fetch Summary
        const resSummary = await fetch('/api/classes/teacher-summary', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resSummary.ok) {
            const data = await resSummary.json();
            setSummary(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-viet-green flex items-center justify-center text-white shadow-lg shadow-viet-green/20">
             <IconClass />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight">
               Bảng Tóm Tắt Giáo Viên
            </h1>
            <p className="text-viet-text-light font-medium">Hệ thống quản lý học tập Odyssey v2.0</p>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-viet-green/20 to-viet-green/5 p-6 rounded-[32px] border border-viet-green/20 relative overflow-hidden group hover:shadow-xl hover:shadow-viet-green/5 transition-all duration-500">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-viet-green uppercase tracking-wider">Tổng số lớp</span>
                <div className="p-2 rounded-lg bg-viet-green/10 text-viet-green group-hover:scale-110 transition-transform">
                   <IconClass />
                </div>
             </div>
             <h2 className="text-4xl font-black text-viet-text tracking-tight">{loading ? '...' : classes.length}</h2>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-viet-green/5 rounded-full blur-3xl group-hover:bg-viet-green/10 transition-colors" />
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-6 rounded-[32px] border border-blue-500/20 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tổng số học sinh</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                   <IconStudents />
                </div>
             </div>
             <h2 className="text-4xl font-black text-viet-text tracking-tight">{loading ? '...' : summary.total_students}</h2>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-6 rounded-[32px] border border-purple-500/20 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Nhiệm vụ đang diễn ra</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
                   <IconTasks />
                </div>
             </div>
             <h2 className="text-4xl font-black text-viet-text tracking-tight">{loading ? '...' : summary.active_assignments}</h2>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
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
                 students={cls.student_count || 0} 
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
