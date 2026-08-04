import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPostLoginPath } from '@/utils/authNavigation';

const readReturnLocation = () => {
    try {
        return JSON.parse(sessionStorage.getItem('aurum-auth-return-to') || 'null');
    } catch {
        return null;
    }
};

const AuthCallback = () => {
    const navigate = useNavigate();
    const { completeGoogleLogin } = useAuth();
    const returnLocationRef = useRef(readReturnLocation());

    useEffect(() => {
        let active = true;

        const handleCallback = async () => {
            const result = await completeGoogleLogin();
            if (!active) return;

            sessionStorage.removeItem('aurum-auth-return-to');
            if (result.success) {
                navigate(getPostLoginPath(result.user, returnLocationRef.current), { replace: true });
            } else {
                navigate('/login?error=' + encodeURIComponent(result.message || 'Không thể đăng nhập bằng Google.'), { replace: true });
            }
        };

        void handleCallback();
        return () => { active = false; };
    }, [completeGoogleLogin, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-viet-bg">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-black text-viet-text uppercase tracking-widest">Đang xác thực...</h2>
                <p className="text-sm text-viet-text-light opacity-60">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
};

export default AuthCallback;
