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
        <header className="mb-8 text-center md:text-left md:mb-3">
           <div className="hidden md:flex items-center gap-2 mb-1 md:mb-2">
              <span className="text-[8px] md:text-[9px] font-black text-viet-green bg-viet-green/5 border border-viet-green/20 px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-widest">
                Đã sẵn sàng học tập?
              </span>
           </div>
           <h2 className="text-[28px] md:text-[22px] font-bold md:font-black text-slate-800 md:text-viet-text tracking-tight md:uppercase font-sora md:italic">
             Đăng nhập
           </h2>
           <p className="text-[14px] md:text-[12px] font-medium md:font-bold text-slate-500 md:text-viet-text-light mt-2 md:mt-1.5 tracking-tight leading-relaxed">
             Chào mừng bạn quay trở lại! 👋
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

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-3">
           <div className="space-y-2 md:space-y-1.5">
              <label className="text-[14px] md:text-[9px] font-bold md:font-black text-slate-700 md:text-viet-text-light md:uppercase tracking-normal md:tracking-[1.5px] pl-1 opacity-100 md:opacity-60">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-viet-green transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full h-12 md:h-11 pl-12 pr-6 rounded-xl md:rounded-2xl bg-[#fdf0e0] md:bg-slate-50 border border-[#f3e3d0] md:border-transparent focus:bg-white focus:border-viet-green focus:shadow-lg shadow-viet-green/5 transition-all outline-none text-[15px] md:text-[14px] font-medium md:font-bold text-slate-800 md:text-viet-text placeholder:text-slate-400/50"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
           </div>

           <div className="space-y-2 md:space-y-1.5">
              <label className="text-[14px] md:text-[9px] font-bold md:font-black text-slate-700 md:text-viet-text-light md:uppercase tracking-normal md:tracking-[1.5px] pl-1 opacity-100 md:opacity-60">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-viet-green transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full h-12 md:h-11 pl-12 pr-12 rounded-xl md:rounded-2xl bg-[#fdf0e0] md:bg-slate-50 border border-[#f3e3d0] md:border-transparent focus:bg-white focus:border-viet-green focus:shadow-lg shadow-viet-green/5 transition-all outline-none text-[15px] md:text-[14px] font-medium md:font-bold text-slate-800 md:text-viet-text placeholder:text-slate-400/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-viet-green">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>
                </button>
              </div>
           </div>


           <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer w-4 h-4 rounded-full border border-slate-300 text-viet-green focus:ring-viet-green transition-all cursor-pointer opacity-0 absolute z-10" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${rememberMe ? 'bg-viet-green border-viet-green' : 'bg-white border-slate-300 group-hover:border-viet-green/50'}`}>
                       {rememberMe && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                  <span className="text-[13px] md:text-[10px] font-medium md:font-black text-slate-600 md:text-viet-text-light md:uppercase md:tracking-widest">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/" className="text-[13px] md:text-[10px] font-bold md:font-black text-viet-green hover:underline md:uppercase md:tracking-widest">Quên mật khẩu?</Link>
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full h-12 md:h-11 bg-viet-green text-white text-[15px] md:text-[11px] font-bold md:font-black md:uppercase md:tracking-[2px] rounded-xl md:rounded-2xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
           >
             {loading ? 'Đang xác thực...' : 'Đăng nhập'}
           </button>
        </form>

        <div className="relative my-6 md:my-2.5 text-center">
           <div className="absolute inset-0 top-1/2 h-[1px] bg-slate-200" />
           <span className="relative z-10 bg-white px-4 text-[13px] md:text-[9px] font-medium md:font-black text-slate-400 md:text-viet-text-light/40 md:uppercase md:tracking-[3px]">Hoặc đăng nhập bằng</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full h-12 md:h-11 bg-[#fdf0e0] md:bg-white border border-[#f3e3d0] md:border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 text-[14px] md:text-[10px] font-bold md:font-black md:uppercase md:tracking-widest text-slate-700 md:text-viet-text hover:bg-slate-50 transition-all mb-6 md:mb-3 shadow-sm active:scale-95"
        >
           <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
           Google
        </button>


        <div className="text-center text-[14px]">
           <span className="text-slate-500 font-medium">Chưa có tài khoản? </span>
           <Link to="/register" className="text-viet-green hover:underline font-bold">
             Đăng ký ngay
           </Link>
        </div>

      </motion.div>
    </AuthLayout>
  );
};

export default Login;
