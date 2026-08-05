import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Atom,
  BookOpen,
  ChevronLeft,
  Compass,
  Dna,
  FlaskConical,
  GraduationCap,
  Lock,
  MapPinned,
  Radiation,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import InfographicBook from '@/components/lessons/InfographicBook';
import PlacementTestModal, { AVAILABLE_PLACEMENT_TEST_GRADES } from '@/components/lessons/PlacementTestModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import './GradeJourney.css';

const CLASS_THEMES = {
  '6': {
    titleKey: 'journey.themes.6.title',
    subtitleKey: 'journey.themes.6.subtitle',
    primary: '#0ea5e9',
    primaryDark: '#0369a1',
    primarySoft: '#e0f2fe',
    primaryGlow: 'rgba(14, 165, 233, 0.36)',
    doodleSymbol: 'H₂O',
  },
  '7': {
    titleKey: 'journey.themes.7.title',
    subtitleKey: 'journey.themes.7.subtitle',
    primary: '#06b6d4',
    primaryDark: '#0e7490',
    primarySoft: '#cffafe',
    primaryGlow: 'rgba(6, 182, 212, 0.36)',
    doodleIcon: FlaskConical,
  },
  '8': {
    titleKey: 'journey.themes.8.title',
    subtitleKey: 'journey.themes.8.subtitle',
    primary: '#65b82e',
    primaryDark: '#3f7f1d',
    primarySoft: '#ecfccb',
    primaryGlow: 'rgba(101, 184, 46, 0.38)',
    doodleSymbol: 'O₂',
  },
  '9': {
    titleKey: 'journey.themes.9.title',
    subtitleKey: 'journey.themes.9.subtitle',
    primary: '#6366f1',
    primaryDark: '#4338ca',
    primarySoft: '#e0e7ff',
    primaryGlow: 'rgba(99, 102, 241, 0.36)',
    doodleIcon: Zap,
  },
  '10': {
    titleKey: 'journey.themes.10.title',
    subtitleKey: 'journey.themes.10.subtitle',
    primary: '#14b8a6',
    primaryDark: '#0f766e',
    primarySoft: '#ccfbf1',
    primaryGlow: 'rgba(20, 184, 166, 0.36)',
    doodleIcon: Atom,
  },
  '11': {
    titleKey: 'journey.themes.11.title',
    subtitleKey: 'journey.themes.11.subtitle',
    primary: '#f43f5e',
    primaryDark: '#be123c',
    primarySoft: '#ffe4e6',
    primaryGlow: 'rgba(244, 63, 94, 0.34)',
    doodleIcon: Dna,
  },
  '12': {
    titleKey: 'journey.themes.12.title',
    subtitleKey: 'journey.themes.12.subtitle',
    primary: '#f59e0b',
    primaryDark: '#b45309',
    primarySoft: '#fef3c7',
    primaryGlow: 'rgba(245, 158, 11, 0.36)',
    doodleIcon: Radiation,
  },
};

const MAP_LAYOUTS = {
  1: {
    desktop: [{ x: 50, y: 52 }],
    mobile: [{ x: 50, y: 52 }],
  },
  2: {
    desktop: [{ x: 25, y: 42 }, { x: 75, y: 58 }],
    mobile: [{ x: 30, y: 32 }, { x: 70, y: 70 }],
  },
  3: {
    desktop: [{ x: 18, y: 31 }, { x: 50, y: 62 }, { x: 82, y: 36 }],
    mobile: [{ x: 30, y: 21 }, { x: 70, y: 50 }, { x: 32, y: 80 }],
  },
  4: {
    desktop: [{ x: 16, y: 30 }, { x: 47, y: 20 }, { x: 30, y: 74 }, { x: 79, y: 69 }],
    mobile: [{ x: 28, y: 16 }, { x: 72, y: 39 }, { x: 30, y: 64 }, { x: 70, y: 87 }],
  },
  5: {
    desktop: [{ x: 15, y: 27 }, { x: 45, y: 21 }, { x: 28, y: 69 }, { x: 59, y: 79 }, { x: 84, y: 51 }],
    mobile: [{ x: 28, y: 13 }, { x: 72, y: 31 }, { x: 29, y: 49 }, { x: 70, y: 68 }, { x: 38, y: 87 }],
  },
};

const LEVELS = ['level1', 'level2', 'level3'];

const ThemeDoodle = ({ theme, size = 28 }) => {
  const Icon = theme.doodleIcon;
  return Icon
    ? <Icon size={size} aria-hidden="true" />
    : <span className="journey-formula" aria-hidden="true">{theme.doodleSymbol}</span>;
};

const buildSmoothPath = (points) => {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midpoint = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    };
    path += ` Q ${current.x} ${current.y} ${midpoint.x} ${midpoint.y}`;
  }

  const penultimate = points[points.length - 2];
  const last = points[points.length - 1];
  return `${path} Q ${penultimate.x} ${penultimate.y} ${last.x} ${last.y}`;
};

const RailSvg = ({ className, path, progress }) => {
  if (!path) return null;

  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="journey-rail-shadow" d={path} vectorEffect="non-scaling-stroke" />
      <path className="journey-rail-bed" d={path} vectorEffect="non-scaling-stroke" />
      <path className="journey-rail-sleepers" d={path} pathLength="100" vectorEffect="non-scaling-stroke" />
      <path className="journey-rail-line" d={path} vectorEffect="non-scaling-stroke" />
      <path
        className="journey-rail-progress"
        d={path}
        pathLength="100"
        style={{ strokeDasharray: `${progress} ${Math.max(100 - progress, 0)}` }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const JourneyRail = ({ count, progress }) => {
  const layout = MAP_LAYOUTS[count] || MAP_LAYOUTS[5];

  return (
    <div className="journey-rail-layer">
      <RailSvg className="journey-rail-svg journey-rail-svg--desktop" path={buildSmoothPath(layout.desktop)} progress={progress} />
      <RailSvg className="journey-rail-svg journey-rail-svg--mobile" path={buildSmoothPath(layout.mobile)} progress={progress} />
    </div>
  );
};

const getQuizCount = (lesson) => {
  if (!lesson.quizzes || Array.isArray(lesson.quizzes)) return 0;
  return LEVELS.reduce((total, level) => total + (lesson.quizzes[level]?.length || 0), 0);
};

const getNextStepLabel = (stars) => {
  if (!stars.level1) return 'Khởi động';
  if (!stars.level2) return 'Luyện hiểu';
  if (!stars.level3) return 'Chốt bài';
  return 'Ôn lại';
};

const StageNode = ({ lesson, globalIndex, localIndex, point, onOpen, reduceMotion }) => {
  const isLocked = !lesson.isUnlocked;
  const completedLevels = LEVELS.filter((level) => (lesson.stars[level] || 0) > 0).length;
  const missionCount = Array.isArray(lesson.challenges) ? lesson.challenges.length : 0;
  const quizCount = getQuizCount(lesson);
  const cleanTitle = lesson.title?.split(': ').pop() || `Bài học ${globalIndex + 1}`;
  const stateClass = isLocked ? 'is-locked' : lesson.isCompleted ? 'is-completed' : 'is-active';
  const statusLabel = isLocked ? 'đang khóa' : lesson.isCompleted ? 'đã hoàn thành' : 'đã mở';

  return (
    <motion.button
      type="button"
      className={`journey-stage-node ${stateClass}`}
      style={{
        '--node-left': `${point.desktop.x}%`,
        '--node-top': `${point.desktop.y}%`,
        '--node-left-mobile': `${point.mobile.x}%`,
        '--node-top-mobile': `${point.mobile.y}%`,
      }}
      data-map-index={localIndex}
      data-side={point.desktop.x > 58 ? 'right' : 'left'}
      aria-disabled={isLocked}
      aria-label={`Chặng ${globalIndex + 1}: ${cleanTitle}, ${statusLabel}`}
      title={isLocked ? `Chặng ${globalIndex + 1} chưa được mở` : cleanTitle}
      onClick={() => onOpen(lesson, globalIndex, isLocked)}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      whileHover={!isLocked && !reduceMotion ? { scale: 1.045, y: -4 } : undefined}
      whileTap={!isLocked && !reduceMotion ? { scale: 0.97 } : undefined}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: localIndex * 0.06 }}
    >
      <span className="journey-stage-stack" aria-hidden="true">
        <span className="journey-stage-plaque">
          <span className="journey-stage-kicker">Chặng</span>
          <strong>{globalIndex + 1}</strong>
          {isLocked && <span className="journey-lock-badge"><Lock size={13} /></span>}
          {lesson.isCompleted && <span className="journey-complete-badge"><Trophy size={13} /></span>}
        </span>
        <span className="journey-stage-pedestal">
          <span className="journey-stage-pedestal-top" />
        </span>
      </span>

      <span className="journey-stage-caption">
        <span className="journey-stage-title">{cleanTitle}</span>
        <span className="journey-stage-stars" aria-hidden="true">
          {LEVELS.map((level) => (
            <Star
              key={level}
              size={13}
              className={(lesson.stars[level] || 0) > 0 ? 'is-earned' : ''}
              fill="currentColor"
            />
          ))}
        </span>
      </span>

      {!isLocked && (
        <span className="journey-stage-popover" aria-hidden="true">
          <span className="journey-popover-eyebrow">Tiếp theo · {getNextStepLabel(lesson.stars)}</span>
          <strong>{cleanTitle}</strong>
          <span className="journey-popover-description">
            {lesson.description || 'Khám phá kiến thức và hoàn thành thử thách của chặng này.'}
          </span>
          <span className="journey-popover-stats">
            <span>{completedLevels}/3 cấp độ</span>
            <span>{missionCount} nhiệm vụ</span>
            <span>{quizCount} câu hỏi</span>
          </span>
        </span>
      )}
    </motion.button>
  );
};

const GradeJourney = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const [bai_hoc, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const activeTheme = CLASS_THEMES[grade] || CLASS_THEMES['8'];

  useEffect(() => {
    const controller = new AbortController();

    const fetchLessons = async () => {
      try {
        const response = await fetch(`/api/lessons?classId=${grade}`, { signal: controller.signal });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Lỗi server (${response.status}): ${text.substring(0, 100)}`);
        }
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Lỗi tải hành trình:', error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchLessons();
    return () => controller.abort();
  }, [grade]);

  useEffect(() => {
    const handleScroll = () => {
      if (!loading) sessionStorage.setItem(`scroll-pos-grade-${grade}`, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [grade, loading]);

  useLayoutEffect(() => {
    if (!loading) {
      const savedPosition = sessionStorage.getItem(`scroll-pos-grade-${grade}`);
      if (savedPosition) setTimeout(() => window.scrollTo(0, Number.parseInt(savedPosition, 10)), 100);
    }
  }, [loading, grade]);

  const handleStageClick = (lesson, index, isLocked) => {
    if (isLocked) return;

    const lessonStars = user?.balancingProgress?.lessonStars?.[lesson.lessonId] || { level1: 0, level2: 0, level3: 0 };
    let targetLevel = 'level1';

    if (lessonStars.level1 > 0 && lessonStars.level2 === 0) targetLevel = 'level2';
    else if (lessonStars.level1 > 0 && lessonStars.level2 > 0 && lessonStars.level3 === 0) targetLevel = 'level3';
    else if (lessonStars.level1 > 0 && lessonStars.level2 > 0 && lessonStars.level3 > 0) targetLevel = 'level3';

    if (targetLevel === 'level1') {
      navigate(`/classroom/${grade}/journey/${lesson.lessonId}/intro?order=${index + 1}`);
      return;
    }

    navigate(`/classroom/${grade}/journey/${lesson.lessonId}/quiz?level=${targetLevel}&order=${index + 1}`);
  };

  if (loading) {
    return (
      <div
        className="journey-loading"
        style={{
          '--journey-primary': activeTheme.primary,
          '--journey-primary-dark': activeTheme.primaryDark,
          '--journey-glow': activeTheme.primaryGlow,
        }}
      >
        <div className="journey-loading-orbit">
          <ThemeDoodle theme={activeTheme} size={34} />
        </div>
        <p>Khai mở bản đồ...</p>
      </div>
    );
  }

  const isFirstLessonDefaultUnlocked = ['6', '7', '8'].includes(grade);
  const isGradePassed = user?.balancingProgress?.passedGrades?.includes(grade);

  const bai_hocStatus = bai_hoc.map((lesson, index) => {
    const previousLessonStars = index > 0
      ? (user?.balancingProgress?.lessonStars?.[bai_hoc[index - 1].lessonId] || { level1: 0, level2: 0, level3: 0 })
      : null;
    const previousLessonFullyCompleted = previousLessonStars
      ? LEVELS.every((level) => previousLessonStars[level] > 0)
      : false;
    const currentLessonStars = user?.balancingProgress?.lessonStars?.[lesson.lessonId] || { level1: 0, level2: 0, level3: 0 };
    const isCompleted = LEVELS.every((level) => currentLessonStars[level] > 0);
    const isUnlocked = user?.role === 'admin'
      || user?.role === 'teacher'
      || (index === 0 && (isFirstLessonDefaultUnlocked || isGradePassed))
      || previousLessonFullyCompleted
      || isCompleted;

    return { ...lesson, isUnlocked, isCompleted, stars: currentLessonStars };
  });

  let highestUnlockedIndex = -1;
  bai_hocStatus.forEach((lesson, index) => {
    if (lesson.isUnlocked) highestUnlockedIndex = index;
  });

  const completedCount = bai_hocStatus.filter((lesson) => lesson.isCompleted).length;
  const completionPercentage = bai_hocStatus.length > 0
    ? (completedCount / bai_hocStatus.length) * 100
    : 0;
  const mapZones = [];
  for (let index = 0; index < bai_hocStatus.length; index += 5) {
    mapZones.push(bai_hocStatus.slice(index, index + 5));
  }

  const lessonOneStars = bai_hoc.length > 0
    ? (user?.balancingProgress?.lessonStars?.[bai_hoc[0].lessonId] || { level1: 0, level2: 0, level3: 0 })
    : { level1: 0, level2: 0, level3: 0 };
  const isLessonOneComplete = LEVELS.every((level) => lessonOneStars[level] > 0);
  const canOpenBook = isLessonOneComplete || user?.role === 'admin' || user?.role === 'teacher';
  const showPlacementTest = grade !== '8'
    && AVAILABLE_PLACEMENT_TEST_GRADES.includes(String(grade))
    && bai_hoc.length > 0
    && !user?.balancingProgress?.passedGrades?.includes(grade)
    && !user?.unlockedLessons?.includes(bai_hoc[0].lessonId)
    && user?.role === 'student';

  return (
    <div
      className="journey-page"
      style={{
        '--journey-primary': activeTheme.primary,
        '--journey-primary-dark': activeTheme.primaryDark,
        '--journey-soft': activeTheme.primarySoft,
        '--journey-glow': activeTheme.primaryGlow,
      }}
    >
      <main className="journey-shell">
        <header className="journey-header">
          <motion.button
            type="button"
            className="journey-round-control journey-back-button"
            onClick={() => navigate('/classroom')}
            aria-label="Quay lại lớp học"
            whileHover={reduceMotion ? undefined : { scale: 1.06 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          >
            <ChevronLeft size={34} strokeWidth={3.5} />
          </motion.button>

          <motion.div
            className="journey-title-board"
            initial={reduceMotion ? false : { opacity: 0, y: -18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="journey-title-icon"><ThemeDoodle theme={activeTheme} size={28} /></div>
            <div className="journey-title-copy">
              <span>{t('journey.badge', { grade })}</span>
              <h1>{activeTheme.titleKey ? t(activeTheme.titleKey) : activeTheme.title}</h1>
              <p>{activeTheme.subtitleKey ? t(activeTheme.subtitleKey) : activeTheme.subtitle}</p>
            </div>
            <div className="journey-progress-wrap" aria-label={`Đã hoàn thành ${completedCount} trên ${bai_hocStatus.length} chặng`}>
              <div className="journey-progress-copy">
                <span>Tiến độ</span>
                <strong>{completedCount}/{bai_hocStatus.length}</strong>
              </div>
              <div className="journey-progress-track" aria-hidden="true">
                <span style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </motion.div>

          <div className="journey-round-control journey-score-badge" aria-label={`${completedCount} chặng đã hoàn thành`}>
            <Trophy size={25} strokeWidth={2.8} />
            <span>{completedCount}</span>
          </div>
        </header>

        {showPlacementTest && (
          <motion.section
            className="journey-placement-card"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <div className="journey-placement-icon"><GraduationCap size={30} /></div>
            <div className="journey-placement-copy">
              <span>{t('journey.test_banner.badge')}</span>
              <h2>{t('journey.test_banner.title', { grade })}</h2>
              <p>{t('journey.test_banner.description', { grade })}</p>
            </div>
            <button type="button" onClick={() => setIsTestOpen(true)}>
              {t('journey.test_banner.button')}
              <ArrowRight size={18} />
            </button>
          </motion.section>
        )}

        {mapZones.length > 0 ? (
          <div className="journey-map-stack">
            {mapZones.map((zone, zoneIndex) => {
              const zoneStart = zoneIndex * 5;
              const localUnlockedIndex = highestUnlockedIndex - zoneStart;
              const zoneProgress = zone.length <= 1
                ? (zone[0]?.isCompleted ? 100 : 0)
                : Math.max(0, Math.min(100, (localUnlockedIndex / (zone.length - 1)) * 100));
              const layout = MAP_LAYOUTS[zone.length] || MAP_LAYOUTS[5];

              return (
                <section
                  key={`zone-${zoneIndex + 1}`}
                  className={`journey-map-zone journey-map-zone--${zone.length}`}
                  aria-labelledby={`journey-zone-${zoneIndex + 1}`}
                >
                  <div className="journey-map-glow" aria-hidden="true" />
                  <div className="journey-zone-label" id={`journey-zone-${zoneIndex + 1}`}>
                    <MapPinned size={17} />
                    <span>Khu vực {zoneIndex + 1}</span>
                    <small>Chặng {zoneStart + 1}–{zoneStart + zone.length}</small>
                  </div>
                  <JourneyRail count={zone.length} progress={zoneProgress} />

                  {zone.map((lesson, localIndex) => (
                    <StageNode
                      key={lesson.id || lesson.lessonId || `${zoneIndex}-${localIndex}`}
                      lesson={lesson}
                      globalIndex={zoneStart + localIndex}
                      localIndex={localIndex}
                      point={{ desktop: layout.desktop[localIndex], mobile: layout.mobile[localIndex] }}
                      onOpen={handleStageClick}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </section>
              );
            })}
          </div>
        ) : (
          <section className="journey-empty-state">
            <Compass size={38} />
            <h2>Bản đồ đang được chuẩn bị</h2>
            <p>Các chặng học của lớp {grade} sẽ sớm xuất hiện tại đây.</p>
            <button type="button" onClick={() => navigate('/classroom')}>Quay lại lớp học</button>
          </section>
        )}

        {bai_hoc.length > 0 && (
          <motion.button
            type="button"
            className={`journey-book-milestone ${canOpenBook ? 'is-open' : 'is-locked'}`}
            aria-disabled={!canOpenBook}
            onClick={() => canOpenBook && setIsBookOpen(true)}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            whileHover={canOpenBook && !reduceMotion ? { y: -4 } : undefined}
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className="journey-book-art" aria-hidden="true">
              <span className="journey-book-spine" />
              <ThemeDoodle theme={activeTheme} size={28} />
              <small>{t('journey.milestone.book_label')}</small>
            </span>
            <span className="journey-book-copy">
              <span className="journey-book-kicker"><Sparkles size={15} /> Cột mốc đặc biệt</span>
              <strong>{canOpenBook ? t('journey.milestone.title') : 'Hoàn thành chặng 1 để mở'}</strong>
              <span>{t('journey.milestone.subtitle', { grade })}</span>
            </span>
            <span className="journey-book-action" aria-hidden="true">
              {canOpenBook ? <BookOpen size={24} /> : <Lock size={22} />}
              <span>{canOpenBook ? 'Mở sổ tay' : 'Chưa mở'}</span>
            </span>
          </motion.button>
        )}
      </main>

      <AnimatePresence>
        {isBookOpen && (
          <InfographicBook
            isOpen={isBookOpen}
            onClose={() => setIsBookOpen(false)}
            bai_hoc={bai_hoc}
            grade={grade}
            unlockedLessons={user?.unlockedLessons}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTestOpen && (
          <PlacementTestModal
            isOpen={isTestOpen}
            onClose={() => setIsTestOpen(false)}
            grade={grade}
            firstLessonId={bai_hoc[0]?.lessonId}
            onPass={() => setIsTestOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradeJourney;
