import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
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
    const { user, isLoggedIn, loading } = useAuth();
    const returnLocationRef = useRef(readReturnLocation());

    useEffect(() => {
        const handleCallback = async () => {
            const { error } = await supabase.auth.getSession();
            if (error) {
                console.error('Auth callback error:', error.message);
                sessionStorage.removeItem('aurum-auth-return-to');
                navigate('/login?error=' + encodeURIComponent(error.message));
            }
        };

        handleCallback();
    }, [navigate]);

    useEffect(() => {
        if (!loading && isLoggedIn && user) {
            sessionStorage.removeItem('aurum-auth-return-to');
            navigate(getPostLoginPath(user, returnLocationRef.current), { replace: true });
        } else if (!loading && !isLoggedIn) {
            sessionStorage.removeItem('aurum-auth-return-to');
            navigate('/login?error=' + encodeURIComponent('Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn.'), { replace: true });
        }
    }, [loading, isLoggedIn, user, navigate]);

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
