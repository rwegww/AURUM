import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPostLoginPath } from '@/utils/authNavigation';
import LoadingScreen from '@/components/common/LoadingScreen';

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

    return <LoadingScreen label="Đang hoàn tất đăng nhập…" />;
};

export default AuthCallback;
