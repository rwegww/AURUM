import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  Radiation,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { BookOpen as BookOpenNode, Lock as LockNode } from 'lucide';
import MorphIcon from '@/components/common/MorphIcon';
import InfographicBook from '@/components/lessons/InfographicBook';
import PlacementTestModal, { AVAILABLE_PLACEMENT_TEST_GRADES } from '@/components/lessons/PlacementTestModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { buildJourneyPath, createJourneyLayout } from '@/utils/journeyLayout';
import {
  countJourneyQuestions,
  getJourneyQuizGroups,
  JOURNEY_LEVELS,
} from '@/utils/journeyLessonData';
import { JOURNEY_THEMES } from '../../../shared/journeyPresentation';
import { getJourneyLessonStatuses, getNextJourneyLevel } from '../../../shared/journeyProgress';
import './GradeJourney.css';

const THEME_ICONS = { '7': FlaskConical, '9': Zap, '10': Atom, '11': Dna, '12': Radiation };
const CLASS_THEMES = Object.fromEntries(Object.entries(JOURNEY_THEMES).map(([grade, theme]) => [grade, { ...theme, doodleIcon: THEME_ICONS[grade], doodleSymbol: theme.symbol }]));

const LEVELS = JOURNEY_LEVELS;

const ThemeDoodle = ({ theme, size = 28 }) => {
  const Icon = theme.doodleIcon;
  return Icon
    ? <Icon size={size} aria-hidden="true" />
    : <span className="journey-formula" aria-hidden="true">{theme.doodleSymbol}</span>;
};

const RailSvg = ({ className, layout, highestUnlockedIndex }) => {
  const path = buildJourneyPath(layout);
  const progressPath = buildJourneyPath(layout, highestUnlockedIndex);
  if (!path) return null;

  return (
    <svg className={className} viewBox={`0 0 100 ${layout.height}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="journey-rail-shadow" d={path} vectorEffect="non-scaling-stroke" />
      <path className="journey-rail-bed" d={path} vectorEffect="non-scaling-stroke" />
      <path className="journey-rail-sleepers" d={path} vectorEffect="non-scaling-stroke" />
      <path className="journey-rail-line" d={path} vectorEffect="non-scaling-stroke" />
      {progressPath && (
        <path className="journey-rail-progress" d={progressPath} vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
};

const JourneyRail = ({ layout, highestUnlockedIndex }) => {
  return (
    <div className="journey-rail-layer" aria-hidden="true">
      <RailSvg className="journey-rail-svg journey-rail-svg--desktop" layout={layout.desktop} highestUnlockedIndex={highestUnlockedIndex} />
      <RailSvg className="journey-rail-svg journey-rail-svg--mobile" layout={layout.mobile} highestUnlockedIndex={highestUnlockedIndex} />
    </div>
  );
};

const getNextStepLabel = (stars) => {
  if (!stars.level1) return 'Xem video + câu hỏi cơ bản';
  if (!stars.level2) return 'Câu hỏi nâng cao';
  if (!stars.level3) return 'Ôn tập tổng hợp';
  return 'Xem lại phần thưởng';
};

const StageNode = ({ lesson, globalIndex, point, onOpen, reduceMotion }) => {
  const isLocked = !lesson.isUnlocked;
  const completedLevels = LEVELS.filter((level) => (lesson.stars[level] || 0) > 0).length;
  const quizGroups = getJourneyQuizGroups(lesson);
  const nextLevel = !lesson.stars.level1
    ? 'level1'
    : !lesson.stars.level2
      ? 'level2'
      : 'level3';
  const nextQuestionCount = quizGroups[nextLevel].length;
  const quizCount = countJourneyQuestions(lesson);
  const cleanTitle = lesson.title?.split(': ').pop() || `Bài học ${globalIndex + 1}`;
  const stateClass = isLocked ? 'is-locked' : lesson.isCompleted ? 'is-completed' : 'is-active';
  const statusLabel = isLocked ? 'đang khóa' : lesson.isCompleted ? 'đã hoàn thành' : 'đã mở';

  return (
    <motion.button
      type="button"
      className={`journey-stage-node ${stateClass}`}
      style={{
        '--node-left': `${point.desktop.x}%`,
        '--node-top': `${point.desktop.y}rem`,
        '--node-left-mobile': `${point.mobile.x}%`,
        '--node-top-mobile': `${point.mobile.y}rem`,
      }}
      data-map-index={globalIndex}
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
      transition={{ duration: 0.35 }}
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
            <span>{completedLevels}/3 sao</span>
            <span>Vòng sau: {nextQuestionCount} câu</span>
            <span>Tổng hợp: {quizCount} câu</span>
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
  const [bookData, setBookData] = useState({ grade: null, lessons: [] });
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState('');
  const [isTestOpen, setIsTestOpen] = useState(false);
  const bookRequestRef = useRef(null);

  const activeTheme = CLASS_THEMES[grade] || CLASS_THEMES['8'];

  useEffect(() => {
    const controller = new AbortController();

    const fetchLessons = async () => {
      try {
        const response = await fetch(`/api/lessons?classId=${grade}&view=journey`, { signal: controller.signal });
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

  useEffect(() => () => bookRequestRef.current?.abort(), [grade]);

  useLayoutEffect(() => {
    if (!loading) {
      const savedPosition = sessionStorage.getItem(`scroll-pos-grade-${grade}`);
      if (savedPosition) setTimeout(() => window.scrollTo(0, Number.parseInt(savedPosition, 10)), 100);
    }
  }, [loading, grade]);

  const handleStageClick = (lesson, index, isLocked) => {
    if (isLocked) return;

    const lessonStars = user?.balancingProgress?.lessonStars?.[lesson.lessonId] || { level1: 0, level2: 0, level3: 0 };
    const targetLevel = getNextJourneyLevel(lessonStars);

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

  const bai_hocStatus = getJourneyLessonStatuses(bai_hoc, user, grade);

  let highestUnlockedIndex = -1;
  bai_hocStatus.forEach((lesson, index) => {
    if (lesson.isUnlocked) highestUnlockedIndex = index;
  });

  const completedCount = bai_hocStatus.filter((lesson) => lesson.isCompleted).length;
  const completionPercentage = bai_hocStatus.length > 0
    ? (completedCount / bai_hocStatus.length) * 100
    : 0;
  const mapLayout = createJourneyLayout(bai_hocStatus.length);
  const sceneryCount = Math.ceil(Math.max(mapLayout.desktop.height, mapLayout.mobile.height) / 28);

  const lessonOneStars = bai_hoc.length > 0
    ? (user?.balancingProgress?.lessonStars?.[bai_hoc[0].lessonId] || { level1: 0, level2: 0, level3: 0 })
    : { level1: 0, level2: 0, level3: 0 };
  const isLessonOneComplete = LEVELS.every((level) => lessonOneStars[level] > 0);
  const canOpenBook = isLessonOneComplete || user?.role === 'admin' || user?.role === 'teacher';
  const showPlacementTest = grade !== '8'
    && user?.balancingProgress?.placement?.required !== true
    && AVAILABLE_PLACEMENT_TEST_GRADES.includes(String(grade))
    && bai_hoc.length > 0
    && !user?.balancingProgress?.passedGrades?.includes(grade)
    && !user?.unlockedLessons?.includes(bai_hoc[0].lessonId)
    && user?.role === 'student';

  const handleOpenBook = async () => {
    if (!canOpenBook || bookLoading) return;
    if (bookData.grade === grade && bookData.lessons.length > 0) {
      setIsBookOpen(true);
      return;
    }

    bookRequestRef.current?.abort();
    const controller = new AbortController();
    bookRequestRef.current = controller;
    setBookLoading(true);
    setBookError('');
    try {
      const response = await fetch(`/api/lessons?classId=${grade}`, { signal: controller.signal });
      const data = await response.json().catch(() => []);
      if (!response.ok || !Array.isArray(data)) throw new Error('Không thể tải nội dung sổ tay.');
      if (bookRequestRef.current !== controller) return;
      setBookData({ grade, lessons: data });
      setIsBookOpen(true);
    } catch (error) {
      if (error.name !== 'AbortError') setBookError(error.message || 'Không thể tải nội dung sổ tay.');
    } finally {
      if (bookRequestRef.current === controller) setBookLoading(false);
    }
  };

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

        {bai_hocStatus.length > 0 ? (
          <section
            className="journey-map"
            aria-label={`Bản đồ hành trình lớp ${grade}, ${bai_hocStatus.length} chặng`}
            style={{
              '--map-height': `${mapLayout.desktop.height}rem`,
              '--map-height-mobile': `${mapLayout.mobile.height}rem`,
            }}
          >
            <div className="journey-map-scenery" aria-hidden="true">
              {Array.from({ length: sceneryCount }, (_, index) => (
                <div
                  key={index}
                  className="journey-map-scenery-tile"
                  style={{ top: `${index * 28 - 4}rem` }}
                />
              ))}
            </div>
            <JourneyRail layout={mapLayout} highestUnlockedIndex={highestUnlockedIndex} />

            {bai_hocStatus.map((lesson, index) => (
              <StageNode
                key={lesson.id || lesson.lessonId || index}
                lesson={lesson}
                globalIndex={index}
                point={{ desktop: mapLayout.desktop.points[index], mobile: mapLayout.mobile.points[index] }}
                onOpen={handleStageClick}
                reduceMotion={reduceMotion}
              />
            ))}
          </section>
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
            onClick={handleOpenBook}
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
              <strong>{bookLoading ? 'Đang chuẩn bị sổ tay...' : canOpenBook ? t('journey.milestone.title') : 'Hoàn thành chặng 1 để mở'}</strong>
              <span>{t('journey.milestone.subtitle', { grade })}</span>
            </span>
            <span className="journey-book-action" aria-hidden="true">
              <MorphIcon icon={canOpenBook ? BookOpenNode : LockNode} size={24} />
              <span>{bookLoading ? 'Đang tải' : canOpenBook ? 'Mở sổ tay' : 'Chưa mở'}</span>
            </span>
          </motion.button>
        )}
        {bookError && <p className="journey-book-error" role="alert">{bookError}</p>}
      </main>

      <AnimatePresence>
        {isBookOpen && (
          <InfographicBook
            isOpen={isBookOpen}
            onClose={() => setIsBookOpen(false)}
            bai_hoc={bookData.grade === grade ? bookData.lessons : []}
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
