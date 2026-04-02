import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Auth callback error:', error.message);
                navigate('/login?error=' + encodeURIComponent(error.message));
            } else if (data?.session) {
                navigate('/');
            } else {
                // If no session yet, AuthProvider listener will catch it
                // but we can redirect to root as a fallback
                navigate('/');
            }
        };

        handleCallback();
    }, [navigate]);

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
