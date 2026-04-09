import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    const savedPassword = localStorage.getItem('rememberPassword');
    
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password, rememberMe);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
        localStorage.setItem('rememberPassword', password); // Basic implementation for cookie-like behavior without actual cookies in LocalStorage
      } else {
        localStorage.removeItem('rememberEmail');
        localStorage.removeItem('rememberPassword');
      }

      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else if (result.user?.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/lessons');
      }
    } else {
      setError(result.message || 'Sai email hoặc mật khẩu');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <AuthLayout>
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.2 }}
        className="flex flex-col"
      >
        <header className="mb-3">
           <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-black text-viet-green bg-viet-green/5 border border-viet-green/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Đã sẵn sàng học tập?
              </span>
           </div>
           <h2 className="text-[22px] font-black text-viet-text tracking-tight uppercase font-sora italic">
             Đăng nhập <span className="text-viet-green">Học viện</span>
           </h2>
           <p className="text-[12px] font-bold text-viet-text-light mt-1.5 tracking-tight opacity-70 leading-relaxed">
             Vui lòng nhập thông tin tài khoản của bạn để tiếp tục cuộc hành trình.
           </p>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase ring-1 ring-red-100 flex items-center gap-2 shadow-sm"
          >
             <span className="text-base">🚨</span> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
           <div className="space-y-1.5">
              <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Email đăng nhập</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-viet-text-light/40 group-focus-within:text-viet-green transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full h-11 pl-12 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green focus:shadow-lg shadow-viet-green/5 transition-all outline-none text-[14px] font-bold text-viet-text placeholder:text-viet-text-light/30"
                  placeholder="hocvien@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-black text-viet-text-light uppercase tracking-[1.5px] pl-1 opacity-60">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-viet-text-light/40 group-focus-within:text-viet-green transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full h-11 pl-12 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-viet-green focus:shadow-lg shadow-viet-green/5 transition-all outline-none text-[14px] font-bold text-viet-text placeholder:text-viet-text-light/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
           </div>

           <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer w-4 h-4 rounded-lg border-2 border-viet-border text-viet-green focus:ring-viet-green transition-all cursor-pointer opacity-0 absolute z-10" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <div className={`w-4 h-4 rounded-lg border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-viet-green border-viet-green' : 'border-viet-border group-hover:border-viet-green/50'}`}>
                       {rememberMe && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-viet-text-light uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Ghi nhớ tôi</span>
              </label>
              <Link to="/" className="text-[10px] font-black text-viet-green hover:underline uppercase tracking-widest">Quên mật khẩu?</Link>
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full h-11 bg-viet-green text-white text-[11px] font-black uppercase tracking-[2px] rounded-2xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
           >
             {loading ? 'Đang xác thực...' : 'Vào học viện ngay ➔'}
           </button>
        </form>

        <div className="relative my-2.5 text-center">
           <div className="absolute inset-0 top-1/2 h-[1px] bg-viet-border/50" />
           <span className="relative z-10 bg-white px-4 text-[9px] font-black text-viet-text-light/40 uppercase tracking-[3px]">Hoặc</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full h-11 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-viet-text hover:bg-slate-50 transition-all mb-3 shadow-sm active:scale-95"
        >
           <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
           Đăng nhập Google
        </button>

        <p className="text-center text-[10px] font-bold text-viet-text-light">
           <span className="opacity-50 uppercase tracking-widest text-[8px] block mb-1 font-black">Chưa có mã học viên?</span>
           <Link to="/register" className="text-viet-green hover:underline uppercase tracking-widest font-black text-[12px]">
             Tham gia hành trình ngay 🧪
           </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
