import React, { useEffect, useRef } from 'react';

const TelegramLoginButton = ({ botName, onAuth, buttonSize = 'large', cornerRadius = 16, requestAccess = 'write' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Make onAuth available globally so the widget can call it
    window.onTelegramAuth = (user) => {
      onAuth(user);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius);
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      delete window.onTelegramAuth;
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess]);

  return <div ref={containerRef} className="flex justify-center w-full" />;
};

export default TelegramLoginButton;
