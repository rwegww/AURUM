import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';

const RoleCard = ({ active, onClick, title, icon }) => (
  <button 
    type="button" onClick={onClick}
    className={`p-3 md:p-3 rounded-xl border flex items-center gap-3 transition-all ${
      active ? 'bg-viet-green/5 border-viet-green text-viet-green shadow-lg shadow-viet-green/5' : 'bg-[#fdf0e0] md:bg-white border-[#f3e3d0] md:border-viet-border text-slate-500 opacity-60 hover:opacity-100'
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-white shadow-sm' : 'bg-white/50 md:bg-slate-50'}`}>
       {icon}
    </div>
    <span className="text-[13px] md:text-[10px] font-bold md:font-black md:uppercase md:tracking-widest">{title}</span>
  </button>
);

const Register = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [proofFile, setProofFile] = useState(null);
  const [grade, setGrade] = useState('8');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, registerTeacher } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    try {
      if (role === 'teacher') {
        if (!proofFile) {
          setError('Vui lòng tải lên tài liệu chứng minh (Thẻ giáo viên, CCCD...)');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', proofFile);
        
        const uploadRes = await fetch('/api/media/upload-public', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadRes.ok) {
          throw new Error('Không thể tải lên ảnh chứng minh');
        }
        
        const uploadData = await uploadRes.json();
        const proofImageUrl = uploadData.url;

        const result = await registerTeacher(username, password, email, proofImageUrl);
        if (result.success) {
          alert('Đăng ký thành công! Vui lòng chờ Quản trị viên xét duyệt.');
          navigate('/login');
        } else {
          setError(result.message);
        }
      } else {
        const result = await register(username, password, email, role, grade);
        if (result.success) {
          navigate('/login');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Lỗi đăng ký tài khoản');
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.2 }}
        className="flex flex-col py-2"
      >
        <header className="mb-6 text-center md:text-left md:mb-3">
           <div className="hidden md:flex items-center gap-2 mb-1 md:mb-1.5">
              <span className="text-[8px] md:text-[9px] font-black text-viet-green bg-viet-green/5 border border-viet-green/20 px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-widest">
                Người gia nhập mới?
              </span>
           </div>
           <h2 className="text-[28px] md:text-[22px] font-bold md:font-black text-slate-800 md:text-viet-text tracking-tight md:uppercase font-sora md:italic">
             Đăng ký
           </h2>
           <p className="text-[14px] md:text-[12px] font-medium md:font-bold text-slate-500 md:text-viet-text-light mt-2 md:mt-1 tracking-tight">
             Tạo tài khoản mới để bắt đầu hành trình ngay!
           </p>
        </header>



        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase ring-1 ring-red-100 flex items-center gap-2 shadow-sm"
          >
             <span className="text-base">🚨</span> {error}
          </motion.div>
        )}

        {/* Role Selector */}
        <div className="mb-5 md:mb-3">
           <label className="text-[13px] md:text-[9px] font-bold md:font-black text-slate-700 md:text-viet-text-light md:uppercase tracking-normal md:tracking-[1.5px] pl-1 mb-2 md:mb-1.5 block">Chọn vai trò của bạn</label>
           <div className="grid grid-cols-2 gap-3 md:gap-3">
              <RoleCard 
                active={role === 'student'} 
                onClick={() => setRole('student')}
                title="Học sinh"
                icon={<svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              />
              <RoleCard 
                active={role === 'teacher'} 
                onClick={() => setRole('teacher')}
                title="Giáo viên"
                icon={<svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              />
           </div>
        </div>



        <form onSubmit={handleSubmit} className="space-y-2">
           {/* Username & Email Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Username</label>
                <div className="relative group">
                  <input 
                    type="text" required
                    className="w-full h-11 pl-4 pr-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green transition-all outline-none text-[13px] font-bold text-viet-text placeholder:text-viet-text-light/30 shadow-sm"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Email</label>
                <div className="relative group">
                  <input 
                    type="email" required
                    className="w-full h-11 pl-4 pr-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green transition-all outline-none text-[13px] font-bold text-viet-text placeholder:text-viet-text-light/30 shadow-sm"
                    placeholder="hocvien@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
           </div>

           {/* Password Fields Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Mật khẩu</label>
                <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} required
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green transition-all outline-none text-[13px] font-bold text-viet-text placeholder:text-viet-text-light/30 shadow-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-viet-text-light/30 hover:text-viet-green">
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Xác nhận</label>
                <div className="relative group">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} required
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green transition-all outline-none text-[13px] font-bold text-viet-text placeholder:text-viet-text-light/30 shadow-sm"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-viet-text-light/30 hover:text-viet-green">
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                </div>
              </div>
           </div>

           {role === 'student' && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="space-y-1 mt-2"
             >
               <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Khối lớp của bạn</label>
               <div className="relative group">
                 <select 
                   required
                   className="w-full h-11 pl-4 pr-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green transition-all outline-none text-[13px] font-bold text-viet-text shadow-sm appearance-none"
                   value={grade}
                   onChange={(e) => setGrade(e.target.value)}
                 >
                   <option value="" disabled>Chọn khối lớp...</option>
                   <option value="8">Lớp 8</option>
                   <option value="9">Lớp 9</option>
                   <option value="10">Lớp 10</option>
                   <option value="11">Lớp 11</option>
                   <option value="12">Lớp 12</option>
                 </select>
                 <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
             </motion.div>
           )}

            {role === 'teacher' && (
              <div className="space-y-2 mt-4">
                <label className="text-[10px] font-bold text-viet-text-light tracking-widest uppercase">
                  Tài Liệu Chứng Minh (Ảnh)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green rounded-xl px-5 py-3 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-viet-green/10 file:text-viet-green hover:file:bg-viet-green/20 text-sm font-bold text-viet-text"
                  />
                  <div className="text-xs text-viet-text-light mt-2 italic px-1">
                    Vui lòng tải lên ảnh Thẻ giáo viên, CCCD... Quản trị viên sẽ gửi kết quả duyệt qua Email.
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full h-12 md:h-11 bg-viet-green text-white text-[15px] md:text-[11px] font-bold md:font-black md:uppercase md:tracking-[2px] rounded-xl md:rounded-xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 md:mt-1 flex items-center justify-center gap-2"
            >
              {loading ? 'Đang khởi tạo...' : 'Đăng ký ngay'}
            </button>
         </form>
 
         <div className="relative my-6 md:my-2.5 text-center">
            <div className="absolute inset-0 top-1/2 h-[1px] bg-slate-200 md:bg-viet-border/50" />
            <span className="relative z-10 bg-white px-4 text-[13px] md:text-[9px] font-medium md:font-black text-slate-400 md:text-viet-text-light/40 md:uppercase md:tracking-[3px]">Hoặc</span>
         </div>
 
         <div className="text-center text-[14px]">
            <span className="text-slate-500 font-medium">Bạn đã có tài khoản? </span>
            <Link to="/login" className="text-viet-green hover:underline font-bold">
              Đăng nhập ngay
            </Link>
         </div>

      </motion.div>
    </AuthLayout>
  );
};

export default Register;
