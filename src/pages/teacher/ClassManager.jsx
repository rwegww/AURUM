import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', grade_level: '10', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setClasses(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newClass, grade_level: parseInt(newClass.grade_level) })
      });
      if (res.ok) {
        setIsCreating(false);
        setNewClass({ name: '', grade_level: '10', description: '' });
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold text-viet-text tracking-tight mb-2">
                👥 Quản Lý Lớp Học
             </h1>
             <p className="text-viet-text-light font-medium">Tạo và quản lý các lớp học, không gian bài tập và sinh hoạt chung.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full md:w-auto px-6 py-3 bg-viet-green text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-viet-green/20 shrink-0"
          >
            + TẠO LỚP MỚI
          </button>
        </header>

        {isCreating && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreate} 
            className="mb-8 p-6 bg-white rounded-[32px] border border-viet-green/30 shadow-lg shadow-viet-green/5 space-y-4"
          >
            <h2 className="text-sm font-black text-viet-green text-center uppercase tracking-widest">Thiết lập Lớp học</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-viet-text-light pl-2">Tên lớp</label>
                  <input type="text" required value={newClass.name} onChange={e=>setNewClass({...newClass, name: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-viet-border outline-none focus:border-viet-green" placeholder="VD: 10A1 Chuyên Hóa" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-viet-text-light pl-2">Khối / Cấp</label>
                  <select value={newClass.grade_level} onChange={e=>setNewClass({...newClass, grade_level: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-viet-border outline-none focus:border-viet-green">
                     <option value="8">Khối 8</option>
                     <option value="9">Khối 9</option>
                     <option value="10">Khối 10</option>
                     <option value="11">Khối 11</option>
                     <option value="12">Khối 12</option>
                  </select>
               </div>
            </div>
            <div>
               <label className="text-[10px] font-black uppercase text-viet-text-light pl-2">Mô tả ngắn</label>
               <input type="text" value={newClass.description} onChange={e=>setNewClass({...newClass, description: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-viet-border outline-none focus:border-viet-green" />
            </div>
            <div className="flex gap-2 justify-end pt-2">
               <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-viet-text-light hover:bg-slate-50 rounded-xl">Hủy</button>
               <button type="submit" className="px-8 py-2.5 bg-viet-green text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md">Tạo ngay</button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
             <div className="col-span-full py-16 text-center border-2 border-dashed border-viet-border rounded-[32px]">
               <span className="text-4xl block opacity-30 mb-2">🏫</span>
               <p className="text-viet-text-light font-bold">Chưa có lớp học nào được tạo.</p>
             </div>
          ) : (
             classes.map(cls => (
                <div key={cls.id} className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                   <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase rounded tracking-widest">Lớp {cls.grade_level}</span>
                      <span className="text-[11px] font-black text-viet-text opacity-50">MÃ: {cls.code}</span>
                   </div>
                   <h3 className="text-xl font-black text-viet-text leading-tight mb-2">{cls.name}</h3>
                   <p className="text-xs font-medium text-viet-text-light mb-6 flex-1">{cls.description}</p>
                   
                   <div className="flex items-center gap-2 pt-4 border-t border-viet-border mt-auto">
                      <button 
                        onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                        className="flex-1 py-3 bg-slate-50 border border-viet-border rounded-xl text-[10px] font-black text-viet-text uppercase tracking-widest hover:bg-viet-green hover:text-white hover:border-viet-green transition-all"
                      >
                         Vào Quản Lý Lớp
                      </button>
                   </div>
                </div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
