import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { activityService } from '@/services/ActivityService';
import { CalendarRange, Flame, Clock, Check } from 'lucide-react';

const getLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const StudyCalendar = ({ planData, onPlanDataChange }) => {
  const { t, i18n } = useTranslation();
  const todayKey = getLocalDateString(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activityDates, setActivityDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [sessionForm, setSessionForm] = useState({
    title: '',
    time: '20:00',
    target: 1,
    completed: false
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load user learning activity logs to show automated completions
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const history = await activityService.getHistory();
        const dates = history
          .filter(item => item.type === 'lesson' || item.type === 'lab')
          .map(item => getLocalDateString(new Date(item.timestamp)));
        setActivityDates([...new Set(dates)]);
      } catch (err) {
        console.error('Failed to load activity logs for calendar:', err);
      }
    };
    loadActivities();
    
    const handleActivityLogged = () => loadActivities();
    window.addEventListener('aurum_activity_logged', handleActivityLogged);
    return () => window.removeEventListener('aurum_activity_logged', handleActivityLogged);
  }, []);

  const customSessions = planData?.customSessions || {};
  const completedDates = planData?.completedDates || [];

  // Monthly navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate Calendar Days (42 cells to fit typical month grid layout)
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month padded days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const dateObj = new Date(year, month - 1, day);
    calendarDays.push({
      day,
      date: dateObj,
      isCurrentMonth: false,
      dateKey: getLocalDateString(dateObj)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    calendarDays.push({
      day,
      date: dateObj,
      isCurrentMonth: true,
      dateKey: getLocalDateString(dateObj)
    });
  }

  // Next month padded days
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    const dateObj = new Date(year, month + 1, day);
    calendarDays.push({
      day,
      date: dateObj,
      isCurrentMonth: false,
      dateKey: getLocalDateString(dateObj)
    });
  }

  const handleCellClick = (dayObj) => {
    const key = dayObj.dateKey;
    if (key < todayKey) {
      alert(t('profile.study_plan.calendar.err_past_date', 'Bạn chỉ có thể lên lịch học cho hôm nay hoặc các ngày trong tương lai!'));
      return;
    }
    setSelectedDay(dayObj);
    const existing = customSessions[key];

    // Determine completion status
    const isCompleted = completedDates.includes(key) || activityDates.includes(key) || !!existing?.completed;

    setSessionForm({
      title: existing?.title || '',
      time: existing?.time || planData.studyTime || '20:00',
      target: existing?.target || planData.dailyLessonTarget || 1,
      completed: isCompleted
    });
    setModalOpen(true);
  };

  const handleSaveSession = () => {
    if (!selectedDay) return;
    const key = selectedDay.dateKey;

    // 1. Update Custom Sessions
    const updatedSessions = {
      ...customSessions,
      [key]: {
        title: sessionForm.title,
        time: sessionForm.time,
        target: sessionForm.target,
        completed: sessionForm.completed
      }
    };

    // 2. Update Completed Dates array
    let updatedCompleted = [...completedDates];
    if (sessionForm.completed) {
      if (!updatedCompleted.includes(key)) {
        updatedCompleted.push(key);
      }
    } else {
      updatedCompleted = updatedCompleted.filter(d => d !== key);
    }

    onPlanDataChange({
      ...planData,
      customSessions: updatedSessions,
      completedDates: updatedCompleted
    });

    setModalOpen(false);
  };

  const handleDeleteSession = () => {
    if (!selectedDay) return;
    const key = selectedDay.dateKey;

    const updatedSessions = { ...customSessions };
    delete updatedSessions[key];

    const updatedCompleted = completedDates.filter(d => d !== key);

    onPlanDataChange({
      ...planData,
      customSessions: updatedSessions,
      completedDates: updatedCompleted
    });

    setModalOpen(false);
  };

  // Filter custom sessions for the current view month and sort them (upcoming or today only)
  const currentMonthSchedules = Object.entries(customSessions)
    .filter(([key]) => {
      const [y, m] = key.split('-');
      return parseInt(y) === year && parseInt(m) === (month + 1) && key >= todayKey;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="mt-12 pt-12 border-t border-viet-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-black text-viet-text flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-viet-green shrink-0" />
            {t('profile.study_plan.calendar.title', 'Lịch học tập cá nhân')}
          </h3>
          <p className="text-viet-text-light/60 font-medium text-sm mt-1">
            Click vào ngày bất kỳ để lên lịch hoặc ghi chú buổi học.
          </p>
        </div>

        {/* Month selector controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-10 h-10 rounded-xl bg-white border border-viet-border hover:bg-slate-50 text-viet-text flex items-center justify-center font-bold shadow-sm transition-all active:scale-95"
            title={t('profile.study_plan.calendar.prev_month', 'Tháng trước')}
          >
            ←
          </button>
          <span className="px-5 py-2 rounded-xl bg-viet-text text-white font-black text-sm min-w-[140px] text-center uppercase tracking-wide">
            {currentDate.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-xl bg-white border border-viet-border hover:bg-slate-50 text-viet-text flex items-center justify-center font-bold shadow-sm transition-all active:scale-95"
            title={t('profile.study_plan.calendar.next_month', 'Tháng sau')}
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-50/50 rounded-[32px] border border-viet-border p-6 shadow-inner">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {[
            t('profile.study_plan.calendar.weekday_sun', 'CN'),
            t('profile.study_plan.calendar.weekday_mon', 'T2'),
            t('profile.study_plan.calendar.weekday_tue', 'T3'),
            t('profile.study_plan.calendar.weekday_wed', 'T4'),
            t('profile.study_plan.calendar.weekday_thu', 'T5'),
            t('profile.study_plan.calendar.weekday_fri', 'T6'),
            t('profile.study_plan.calendar.weekday_sat', 'T7')
          ].map((d, index) => (
            <div key={index} className={`text-[11px] font-black uppercase tracking-widest ${index === 0 ? 'text-red-500/70' : 'text-viet-text-light/50'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayObj, index) => {
            const { day, isCurrentMonth, dateKey } = dayObj;
            const isToday = dateKey === todayKey;
            const isPast = dateKey < todayKey;
            
            // Check scheduled status
            const session = customSessions[dateKey];
            const isScheduled = !!session;
            
            // Check completion status
            const isCompleted = completedDates.includes(dateKey) || activityDates.includes(dateKey) || !!session?.completed;

            return (
              <motion.div
                key={index}
                whileHover={isPast ? {} : { y: -2 }}
                onClick={() => handleCellClick(dayObj)}
                className={`aspect-square rounded-2xl border transition-all p-2 flex flex-col justify-between relative shadow-sm ${
                  isPast && !isCompleted
                    ? 'bg-slate-50/30 border-slate-100 opacity-40 cursor-not-allowed'
                    : !isCurrentMonth 
                    ? 'bg-transparent border-transparent opacity-20 cursor-default' 
                    : isToday 
                    ? 'bg-white border-viet-green border-2 ring-4 ring-viet-green/10 cursor-pointer' 
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-200 cursor-pointer'
                    : isScheduled
                    ? 'bg-blue-50/50 border-blue-200 cursor-pointer'
                    : 'bg-white border-viet-border hover:border-viet-green/50 cursor-pointer'
                }`}
              >
                {/* Date number */}
                <span className={`text-[14px] font-black ${
                  isToday ? 'text-viet-green' : isCompleted ? 'text-emerald-700' : 'text-viet-text'
                }`}>
                  {day}
                </span>

                {/* Status indicators */}
                <div className="flex flex-wrap gap-1 items-center justify-end h-6">
                  {isCompleted && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 flex items-center justify-center" 
                      title="Hoàn thành học tập"
                    >
                      <Flame size={14} className="text-emerald-500 fill-emerald-500" />
                    </motion.div>
                  )}
                  {isScheduled && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-lg bg-blue-500 text-white flex items-center justify-center"
                      title={session.title || "Lịch học tùy chỉnh"}
                    >
                      <Clock size={10} />
                    </motion.div>
                  )}
                </div>

                {/* Micro preview on desktop */}
                {isScheduled && session.title && (
                  <span className="hidden md:block absolute bottom-1 left-2 right-2 text-[9px] font-medium text-blue-600 truncate">
                    {session.title}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upcoming custom schedules list */}
      <div className="mt-8">
        <h4 className="text-[13px] font-black text-viet-text uppercase tracking-widest mb-4 pl-2">
          {t('profile.study_plan.calendar.upcoming_title', 'Lịch học tùy chỉnh sắp tới')}
        </h4>
        
        {currentMonthSchedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMonthSchedules.map(([key, value]) => {
              const [y, m, d] = key.split('-');
              const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
              const isCompleted = completedDates.includes(key) || activityDates.includes(key) || !!value.completed;
              
              return (
                <div 
                  key={key} 
                  onClick={() => handleCellClick({ dateKey: key, date: dateObj, day: parseInt(d), isCurrentMonth: true })}
                  className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform ${
                    isCompleted 
                      ? 'bg-emerald-50/40 border-emerald-100' 
                      : 'bg-white border-viet-border hover:border-viet-green/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-viet-text'
                    }`}>
                      <span className="text-[10px] leading-none uppercase">{dateObj.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' })}</span>
                      <span className="text-lg leading-none mt-0.5">{d}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-[15px] text-viet-text">
                        {value.title || `Báo thức học tập ${value.time}`}
                      </h5>
                      <p className="text-[12px] text-viet-text-light/60 font-medium">
                        {t('profile.study_plan.calendar.item_time', { time: value.time })} • {t('profile.study_plan.calendar.item_target', { count: value.target })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {isCompleted ? <Check className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-viet-border border-dashed text-viet-text-light/50 font-medium text-sm">
            {t('profile.study_plan.calendar.upcoming_empty', 'Chưa có lịch học tùy chỉnh nào được lên kế hoạch trong tháng này. Hãy click vào bất kỳ ngày nào trên lịch để lên lịch học của riêng bạn!')}
          </div>
        )}
      </div>

      {/* Scheduling Modal */}
      <AnimatePresence>
        {modalOpen && selectedDay && (
          <div className="fixed inset-0 bg-viet-text/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] border-2 border-viet-border border-b-[8px] p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute right-6 top-6 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center font-bold text-lg opacity-40 hover:opacity-100 transition-all"
              >
                ✕
              </button>

              <h3 className="text-2xl font-black text-viet-text mb-2">
                {t('profile.study_plan.calendar.schedule_modal_title', 'Chi tiết ngày học')}
              </h3>
              <p className="text-sm font-bold text-viet-green uppercase tracking-wider mb-6">
                {selectedDay.date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="space-y-5">
                {/* Title Form Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-viet-text uppercase tracking-widest pl-1">
                    {t('profile.study_plan.calendar.input_title_label', 'Nội dung/Ghi chú')}
                  </label>
                  <input
                    type="text"
                    value={sessionForm.title}
                    onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                    placeholder={t('profile.study_plan.calendar.input_title_placeholder', 'VD: Ôn tập chương 1, thực hành phản ứng...')}
                    className="w-full h-14 bg-slate-50 border border-viet-border rounded-xl px-4 font-bold text-sm focus:border-viet-green focus:ring-4 focus:ring-viet-green/10 outline-none transition-all"
                  />
                </div>

                {/* Time & Target Forms */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-viet-text uppercase tracking-widest pl-1">
                      {t('profile.study_plan.calendar.input_time_label', 'Giờ học tùy chỉnh')}
                    </label>
                    <input
                      type="time"
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      className="w-full h-14 bg-slate-50 border border-viet-border rounded-xl px-4 font-black text-sm focus:border-viet-green focus:ring-4 focus:ring-viet-green/10 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-viet-text uppercase tracking-widest pl-1">
                      {t('profile.study_plan.calendar.input_target_label', 'Số lượng bài học')}
                    </label>
                    <select
                      value={sessionForm.target}
                      onChange={(e) => setSessionForm({ ...sessionForm, target: parseInt(e.target.value) })}
                      className="w-full h-14 bg-slate-50 border border-viet-border rounded-xl px-4 font-black text-sm focus:border-viet-green focus:ring-4 focus:ring-viet-green/10 outline-none transition-all"
                    >
                      {[1, 2, 3, 5].map(n => (
                        <option key={n} value={n}>{n} bài</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Completed Toggle */}
                <button
                  onClick={() => setSessionForm({ ...sessionForm, completed: !sessionForm.completed })}
                  className={`w-full h-14 rounded-2xl border px-5 flex items-center justify-between transition-all ${
                    sessionForm.completed 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                      : 'bg-slate-50 border-viet-border opacity-70'
                  }`}
                >
                  <span className="font-black text-sm flex items-center gap-1.5">
                    <Flame size={16} className="text-emerald-500 fill-emerald-500 shrink-0" /> {t('profile.study_plan.calendar.status_completed', 'Đã hoàn thành mục tiêu')}
                  </span>
                  <div className={`w-8 h-5 rounded-full relative transition-colors ${sessionForm.completed ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${sessionForm.completed ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-2">
                <button
                  onClick={handleSaveSession}
                  className="w-full py-4 bg-viet-green text-white font-black rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px] uppercase tracking-wider text-sm transition-all"
                >
                  {t('profile.study_plan.calendar.btn_save', 'Lưu lịch học')}
                </button>
                
                {customSessions[selectedDay.dateKey] && (
                  <button
                    onClick={handleDeleteSession}
                    className="w-full py-3 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-colors uppercase tracking-wider text-xs"
                  >
                    {t('profile.study_plan.calendar.btn_delete', 'Xóa lịch')}
                  </button>
                )}

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full py-3 text-viet-text-light hover:text-viet-text font-bold rounded-2xl transition-colors uppercase tracking-wider text-xs"
                >
                  {t('profile.study_plan.calendar.btn_cancel', 'Hủy bỏ')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyCalendar;
