import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTranslation, Trans } from 'react-i18next';
import Avatar from '@/components/common/Avatar';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';

const FloatingWidget = () => {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  
  // Widget open & expanded states
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('missions'); // 'missions' | 'feedback'

  // Missions states
  const [missions, setMissions] = useState([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [missionsActiveTab, setMissionsActiveTab] = useState('daily'); // 'daily' | 'achievement'
  const [claimingId, setClaimingId] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [claimableCount, setClaimableCount] = useState(0);

  // Direct Feedback Form states
  const [feedbackType, setFeedbackType] = useState('suggestion'); // 'suggestion' | 'bug' | 'praise'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Interval for countdown and polling
  useEffect(() => {
    // Timer for daily reset
    const timer = setInterval(() => {
      const now = new Date();
      const resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0);
      const diff = resetTime - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Listen to global open events
  useEffect(() => {
    const handleOpenMissions = () => {
      setIsExpanded(true);
      setActiveTab('missions');
    };
    const handleOpenFeedback = () => {
      setIsExpanded(true);
      setActiveTab('feedback');
    };

    window.addEventListener('aurum_open_missions', handleOpenMissions);
    window.addEventListener('aurum_open_feedback', handleOpenFeedback);

    return () => {
      window.removeEventListener('aurum_open_missions', handleOpenMissions);
      window.removeEventListener('aurum_open_feedback', handleOpenFeedback);
    };
  }, []);

  // Fetch missions if logged in
  const fetchMissions = async () => {
    if (!isLoggedIn) return;
    setLoadingMissions(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/missions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMissions(data);
        const count = data.filter(m => m.isCompleted && !m.isClaimed).length;
        setClaimableCount(count);
      }
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    } finally {
      setLoadingMissions(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMissions();
      // Poll missions every 2 minutes
      const interval = setInterval(fetchMissions, 120000);
      return () => clearInterval(interval);
    } else {
      setMissions([]);
      setClaimableCount(0);
    }
  }, [isLoggedIn]);

  // Claim Mission Reward
  const claimReward = async (missionId) => {
    setClaimingId(missionId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/missions/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ missionId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          await fetchMissions();
        }
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaimingId(null);
    }
  };

  // Paste Screenshot Handler
  const handlePaste = (e) => {
    if (activeTab !== 'feedback' || feedbackType !== 'bug') return;
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const newFile = new File([file], `pasted-image-${Date.now()}.png`, { type: file.type });
          setImageFile(newFile);
        }
        break;
      }
    }
  };

  // Submit Feedback Chat Message
  const handleSendFeedback = async (e) => {
    if (e) e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setSendingFeedback(true);

    try {
      const token = localStorage.getItem('token');
      let imageUrl = null;

      if (feedbackType === 'bug' && imageFile) {
        const uploadData = await uploadToCloudinary(imageFile, 'chemistry-odyssey/bug-reports');
        imageUrl = uploadData.url;
      }

      const res = await fetch('/api/admin/feedback/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ type: feedbackType, message: feedbackMessage, imageUrl })
      });

      if (res.ok) {
        setFeedbackSuccess(true);
      } else {
        throw new Error('Gửi thất bại');
      }
    } catch (err) {
      console.error('Lỗi gửi phản hồi:', err);
      alert(t('widget.err_network') || 'An error occurred. Please try again later.');
    } finally {
      setSendingFeedback(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const filteredMissions = missions.filter(m => m.type === missionsActiveTab);

  return (
    <>
      {/* 1. COLLAPSED FLOATING BUBBLE BUTTON */}
      {!isExpanded && (
        <button 
          onClick={() => {
            setIsExpanded(true);
            if (!isLoggedIn) {
              setActiveTab('feedback');
            }
          }}
          className="fixed bottom-6 right-6 w-16 h-16 bg-viet-green text-white rounded-full shadow-[0_8px_24px_rgba(118,192,52,0.4)] flex items-center justify-center text-3xl hover:scale-110 hover:bg-[#007042] transition-all duration-300 z-50 cursor-pointer group"
          aria-label={t('widget.tooltip')}
        >
          <span className="relative">
            💬
            {claimableCount > 0 && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                {claimableCount}
              </span>
            )}
          </span>
          <span className="absolute right-full mr-4 px-4 py-2 bg-viet-text text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            {t('widget.tooltip')}
          </span>
        </button>
      )}

      {/* 2. EXPANDED MESSENGER-STYLE CHAT WINDOW */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed bottom-4 right-4 z-50 w-full max-w-[390px] h-[580px] md:h-[620px] bg-white border border-[#e6e2d6] rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-sm:w-[calc(100vw-2rem)] max-sm:h-[calc(100vh-2rem)] max-sm:bottom-4 max-sm:right-4 max-sm:left-4">
            
            {/* CHAT HEADER */}
            <div className="bg-viet-green text-white px-5 py-4 flex items-center justify-between border-b border-[#005a35] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl relative">
                  🤖
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-viet-green animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-sm tracking-tight leading-none uppercase italic">{t('widget.title')}</h3>
                  <span className="text-[10px] text-white/80 font-bold">{t('widget.status_active')}</span>
                </div>
              </div>
              
              {/* Functional Controls */}
              <div className="flex items-center gap-2">
                {/* Collapse / Minimize button */}
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg leading-none transition-colors cursor-pointer"
                  title={t('widget.minimize')}
                >
                  −
                </button>
                {/* Close button */}
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm leading-none transition-colors cursor-pointer"
                  title={t('widget.close')}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* TAB SELECTOR (SUB-HEADER) */}
            <div className="flex border-b border-[#e6e2d6] bg-viet-bg/30 p-1.5 gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('missions')}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'missions'
                  ? 'bg-white text-viet-green shadow-sm border border-[#e6e2d6]'
                  : 'text-viet-text-light hover:text-viet-text'
                }`}
              >
                📅 {t('nav.missions')}
                {claimableCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full leading-none">
                    {claimableCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'feedback'
                  ? 'bg-white text-viet-green shadow-sm border border-[#e6e2d6]'
                  : 'text-viet-text-light hover:text-viet-text'
                }`}
              >
                💬 {t('nav.feedback')}
              </button>
            </div>

            {/* BODY CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#fffbf2]">
              
              {/* TAB 1: MISSIONS */}
              {activeTab === 'missions' && (
                <div className="space-y-4">
                  {!isLoggedIn ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-4">
                      <span className="text-5xl">🔒</span>
                      <h4 className="font-black text-viet-text uppercase tracking-tight text-lg">{t('widget.login_required')}</h4>
                      <p className="text-xs font-semibold text-viet-text-light">
                        {t('widget.login_required_desc')}
                      </p>
                      <a 
                        href="/login" 
                        onClick={() => setIsExpanded(false)}
                        className="px-6 py-3 bg-viet-green text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md hover:bg-[#007042] transition-colors"
                      >
                        {t('widget.login_now')}
                      </a>
                    </div>
                  ) : (
                    <>
                      {/* Compact Profile summary */}
                      <div className="bg-white rounded-2xl border border-[#e6e2d6] p-4 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                            <Avatar seed={user?.avatarSeed || user?.username} size={56} streakCount={user?.streakCount} level={user?.level} />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-viet-text-light/50 uppercase tracking-wider">{user?.username}</p>
                            <h4 className="font-black text-viet-text leading-none italic uppercase">
                              {t('widget.level_prefix')} <span className="text-viet-green">{user?.level || 1}</span>
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[9px] font-extrabold bg-viet-green/10 text-viet-green px-2 py-0.5 rounded-full border border-viet-green/15">
                                {user?.xp || 0} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Streak Badge */}
                        <div className="bg-viet-bg border border-[#e6e2d6] rounded-xl px-3 py-2 text-center shrink-0">
                          <p className="text-[8px] font-black text-viet-text-light/40 uppercase tracking-widest leading-none mb-1">{t('widget.streak')}</p>
                          <div className="flex items-center gap-1 justify-center leading-none">
                            <span className="text-base font-black text-viet-text">{user?.streakCount || 0}</span>
                            <span className="text-sm">🔥</span>
                          </div>
                        </div>
                      </div>

                      {/* Daily countdown */}
                      {missionsActiveTab === 'daily' && (
                        <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-[2px] text-viet-text-light">
                          <span>⏳ {t('widget.reset_in')}</span>
                          <span className="text-viet-text font-black">{timeLeft}</span>
                        </div>
                      )}

                      {/* Inner tabs (Daily / Achievement) */}
                      <div className="flex gap-2">
                        {[
                          { id: 'daily', label: t('missions.tabs.daily'), icon: '📅' },
                          { id: 'achievement', label: t('missions.tabs.achievement'), icon: '🏆' }
                        ].map(subTab => (
                          <button
                            key={subTab.id}
                            onClick={() => setMissionsActiveTab(subTab.id)}
                            className={`flex-1 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                              missionsActiveTab === subTab.id
                              ? 'bg-viet-text border-viet-text text-white shadow-sm'
                              : 'bg-white border-[#e6e2d6] text-viet-text-light hover:border-viet-green/30'
                            }`}
                          >
                            {subTab.icon} {subTab.label}
                          </button>
                        ))}
                      </div>

                      {/* Mission List */}
                      {loadingMissions ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : filteredMissions.length > 0 ? (
                        <div className="space-y-3">
                          {filteredMissions.map((mission) => {
                            const progress = Math.min(100, (mission.currentCount / mission.target_count) * 100);
                            const isClaimable = mission.isCompleted && !mission.isClaimed;

                            return (
                              <div 
                                key={mission.id}
                                className={`bg-white border rounded-2xl p-4 transition-all relative overflow-hidden ${
                                  mission.isClaimed ? 'opacity-60' : 'hover:border-viet-green'
                                } ${isClaimable ? 'border-viet-green shadow-sm shadow-viet-green/10' : 'border-[#e6e2d6]'}`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl border ${
                                      isClaimable ? 'bg-viet-green/10 border-viet-green/20 text-viet-green' : 'bg-viet-bg border-[#e6e2d6]'
                                    }`}>
                                      {mission.icon || '🎯'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-xs font-black text-viet-text uppercase tracking-tight italic truncate">{mission.title}</h5>
                                      <p className="text-[10px] font-semibold text-viet-text-light leading-tight mt-0.5 mb-2.5">{mission.description}</p>
                                      
                                      {/* Micro Progress Bar */}
                                      <div className="relative">
                                        <div className="flex justify-between items-center text-[8px] font-black text-viet-text-light/50 tracking-wider mb-1">
                                          <span>{mission.isClaimed ? t('missions.card.claimed') : mission.isCompleted ? t('missions.card.completed') : t('missions.card.in_progress')}</span>
                                          <span>{mission.currentCount}/{mission.target_count}</span>
                                        </div>
                                        <div className="h-2 bg-viet-bg rounded-full border border-[#e6e2d6] overflow-hidden p-0.5">
                                          <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                              mission.isCompleted ? 'bg-viet-green' : 'bg-amber-500'
                                            }`}
                                            style={{ width: `${progress}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Reward and Action Button */}
                                  <div className="flex flex-col items-end shrink-0 gap-2">
                                    <div className="px-2.5 py-1 bg-viet-green rounded-lg text-center">
                                      <p className="text-[7px] font-black text-white/50 uppercase leading-none">{t('widget.reward')}</p>
                                      <p className="text-[10px] font-black text-white leading-none">+{mission.xp_reward}XP</p>
                                    </div>

                                    {isClaimable ? (
                                      <button
                                        onClick={() => claimReward(mission.id)}
                                        disabled={claimingId === mission.id}
                                        className="px-3.5 py-1.5 bg-viet-text text-white rounded-xl font-black text-[9px] uppercase tracking-wider shadow-sm hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                                      >
                                        {claimingId === mission.id ? '...' : t('widget.claim')}
                                      </button>
                                    ) : mission.isClaimed ? (
                                      <div className="px-3.5 py-1.5 bg-viet-bg text-viet-text-light/30 rounded-xl font-black text-[9px] uppercase border border-[#e6e2d6]">
                                        {t('widget.claimed')}
                                      </div>
                                    ) : (
                                      <div className="px-3 py-1.5 bg-white text-viet-text-light/35 rounded-xl font-black text-[9px] uppercase border border-dashed border-[#e6e2d6] cursor-default">
                                        {t('widget.locked')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-white border border-dashed border-[#e6e2d6] rounded-2xl py-12 text-center">
                          <span className="text-3xl mb-2 block">💤</span>
                          <p className="text-xs font-bold text-viet-text-light">{t('widget.no_missions')}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: DIRECT FEEDBACK */}
              {activeTab === 'feedback' && (
                <div className="flex flex-col h-full min-h-[420px] justify-between">
                  {feedbackSuccess ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl animate-bounce">
                        ✓
                      </div>
                      <h4 className="font-black text-viet-text text-lg uppercase tracking-tight">{t('widget.success_title')}</h4>
                      <p className="text-xs font-semibold text-viet-text-light px-6">
                        {t('widget.success_desc')}
                      </p>
                      <button
                        onClick={() => {
                          setFeedbackSuccess(false);
                          setFeedbackMessage('');
                          setImageFile(null);
                        }}
                        className="px-6 py-2.5 bg-viet-green text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md hover:bg-[#007042] transition-colors cursor-pointer"
                      >
                        {t('widget.send_another')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendFeedback} onPaste={handlePaste} className="space-y-4 flex flex-col h-full justify-between">
                      <div className="space-y-4">
                        {/* Task Selector: 3 separate buttons */}
                        <div>
                          <label className="text-[10px] font-black text-viet-text-light/50 uppercase tracking-widest block mb-2">{t('widget.feedback_type')}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'suggestion', label: t('widget.type_suggestion') },
                              { id: 'bug', label: t('widget.type_bug') },
                              { id: 'praise', label: t('widget.type_praise') }
                            ].map(type => {
                              const isSelected = feedbackType === type.id;
                              let selectStyles = '';
                              if (isSelected) {
                                if (type.id === 'suggestion') selectStyles = 'border-amber-500 text-amber-600 shadow-sm bg-amber-50/10';
                                else if (type.id === 'bug') selectStyles = 'border-red-500 text-red-600 shadow-sm bg-red-50/10';
                                else selectStyles = 'border-pink-500 text-pink-600 shadow-sm bg-pink-50/10';
                              } else {
                                selectStyles = 'border-[#e6e2d6] text-viet-text-light hover:border-viet-green/30 bg-white';
                              }

                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => {
                                    setFeedbackType(type.id);
                                    setImageFile(null);
                                  }}
                                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-tighter transition-all cursor-pointer ${selectStyles}`}
                                >
                                  {type.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Input Message Area */}
                        <div>
                          <label className="text-[10px] font-black text-viet-text-light/50 uppercase tracking-widest block mb-2">{t('widget.feedback_details')}</label>
                          <textarea
                            required
                            rows="5"
                            placeholder={
                              feedbackType === 'suggestion' 
                              ? t('widget.placeholder_suggestion') 
                              : feedbackType === 'bug' 
                              ? t('widget.placeholder_bug') 
                              : t('widget.placeholder_praise')
                            }
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            className="w-full p-4 rounded-xl border border-[#e6e2d6] bg-white text-xs font-semibold focus:outline-none focus:border-viet-green transition-all resize-none placeholder:text-viet-text-light/30"
                          />
                        </div>

                        {/* Attachment Area (Only for Bug report) */}
                        {feedbackType === 'bug' && (
                          <div className="space-y-2 border border-dashed border-[#e6e2d6] rounded-xl p-3 bg-white">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-[#e6e2d6] hover:bg-slate-100 px-3 py-2 rounded-lg text-[9px] font-black uppercase text-slate-700 transition">
                                {t('widget.attach_image')}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleFileChange}
                                />
                              </label>
                              {imageFile && (
                                <button 
                                  type="button"
                                  onClick={() => setImageFile(null)}
                                  className="text-red-500 hover:text-red-700 font-extrabold text-[9px] uppercase cursor-pointer"
                                >
                                  {t('widget.remove')}
                                </button>
                              )}
                            </div>
                            {imageFile ? (
                              <div className="text-[10px] text-green-700 font-bold truncate max-w-full">
                                📎 {imageFile.name}
                              </div>
                            ) : (
                              <p className="text-[8px] text-viet-text-light/40 font-bold leading-tight">
                                {t('widget.attach_hint')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={sendingFeedback || !feedbackMessage.trim()}
                        className={`w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                          feedbackType === 'suggestion' 
                          ? 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-600 text-white' 
                          : feedbackType === 'bug' 
                          ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600 text-white' 
                          : 'bg-pink-500 shadow-pink-500/20 hover:bg-pink-600 text-white'
                        }`}
                      >
                        {sendingFeedback 
                          ? t('widget.sending') 
                          : feedbackType === 'suggestion' 
                          ? t('widget.send_suggestion') 
                          : feedbackType === 'bug' 
                          ? t('widget.send_bug') 
                          : t('widget.send_praise')}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingWidget;
