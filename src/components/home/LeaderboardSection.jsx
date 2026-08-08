import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  Award,
  Clock3,
  Gauge,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import Avatar from '@/components/common/Avatar';

const isOnline = (user) => Boolean(user?.isOnline || user?.computedIsOnline);

const OnlineBadge = ({ user, t, inverse = false, compactOnMobile = false }) => {
  if (!isOnline(user)) return null;

  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full py-1 text-[10px] font-black uppercase tracking-[0.12em] ${compactOnMobile ? 'px-2 sm:px-3' : 'px-3'} ${inverse ? 'bg-white/10 text-white' : 'bg-[#e9f6df] text-[#2f6722]'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${inverse ? 'bg-[#b7e77e]' : 'bg-viet-green'}`} aria-hidden="true" />
      <span className={compactOnMobile ? 'sr-only sm:not-sr-only' : ''}>{t('home.leaderboard.online')}</span>
    </span>
  );
};

const ChampionCard = ({ user, formatNumber, formatStudyTime, reducedMotion, t }) => (
  <motion.article
    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    className="relative isolate overflow-hidden rounded-[32px] border border-[#244c40] bg-[#173c31] text-white shadow-[0_8px_0_#102c25]"
  >
    <div aria-hidden="true" className="absolute -bottom-24 -right-20 -z-10 h-64 w-64 rounded-full border-[44px] border-white/[0.04]" />

    <div className="p-6 sm:p-8 lg:p-9">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#d9efc7]">
          <Trophy size={14} aria-hidden="true" />
          {t('home.leaderboard.leader')}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6 sm:gap-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="w-fit shrink-0 rounded-full bg-[#f4cc54] p-1 shadow-[0_0_0_5px_rgba(255,255,255,0.08)]">
            <Avatar
              seed={user.avatarSeed || user.username}
              src={user.avatarUrl}
              size={96}
              className="bg-white"
            />
          </div>
          <div className="min-w-0">
            <OnlineBadge user={user} t={t} inverse />
            <h3 className="mt-2 break-words font-rubik text-2xl font-bold leading-tight sm:truncate sm:text-4xl">
              {user.username}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 border-t border-white/10 pt-6 sm:grid-cols-3">
        <div className="col-span-2 border-b border-white/10 pb-5 sm:col-span-1 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
            {t('home.leaderboard.points')}
          </p>
          <p className="mt-1 whitespace-nowrap font-rubik text-3xl font-bold text-[#f4cc54]">
            {formatNumber(user.xp)} <span className="text-xs font-black">XP</span>
          </p>
        </div>
        <div className="pt-5 pr-4 sm:px-5 sm:pt-0">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
            <Gauge size={13} aria-hidden="true" /> {t('home.leaderboard.level')}
          </p>
          <p className="mt-1 font-rubik text-2xl font-bold sm:text-3xl">{user.level || 1}</p>
        </div>
        <div className="border-l border-white/10 pt-5 pl-4 sm:pt-0 sm:pl-5">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
            <Clock3 size={13} aria-hidden="true" /> {t('home.leaderboard.study_time')}
          </p>
          <p className="mt-1 font-rubik text-base font-bold sm:text-lg">
            {formatStudyTime(user.activeMinutes)}
          </p>
        </div>
      </div>
    </div>
  </motion.article>
);

const RunnerUpCard = ({ rank, user, formatNumber, formatStudyTime, reducedMotion, t }) => (
  <motion.article
    initial={reducedMotion ? false : { opacity: 0, x: 18 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
    whileHover={reducedMotion ? undefined : { y: -2 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.4, delay: rank * 0.05, ease: 'easeOut' }}
    className="rounded-[28px] border-2 border-[#dfe3db] border-b-[6px] bg-white p-4 sm:p-5"
  >
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#667064]">
            {t('home.leaderboard.rank')} {rank}
          </span>
          <OnlineBadge user={user} t={t} />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Avatar seed={user.avatarSeed || user.username} src={user.avatarUrl} size={48} />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-viet-text">{user.username}</h3>
            <p className="mt-0.5 text-xs font-bold text-[#70786e]">
              {t('home.leaderboard.level')} {user.level || 1}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#edf0e9] pt-3">
      <span className="flex items-center gap-1.5 text-xs font-bold text-[#70786e]">
        <Clock3 size={14} aria-hidden="true" /> {formatStudyTime(user.activeMinutes)}
      </span>
      <p className="font-rubik text-xl font-bold text-viet-text">
        {formatNumber(user.xp)} <span className="text-[10px] font-black text-[#43752f]">XP</span>
      </p>
    </div>
  </motion.article>
);

const RankingRow = ({ rank, user, topXp, formatNumber, formatStudyTime, reducedMotion, t }) => {
  const progress = topXp > 0
    ? Math.min(100, Math.max(0, Math.round((user.xp / topXp) * 100)))
    : 0;

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, delay: (rank - 4) * 0.08 }}
      className="grid grid-cols-[44px_48px_minmax(0,1fr)] items-center gap-3 px-4 py-4 sm:grid-cols-[48px_52px_minmax(0,1fr)_auto] sm:gap-4 sm:px-6"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border-2 border-[#e2e6de] border-b-4 bg-[#f6f8f3] font-rubik text-lg font-bold text-viet-text-light">
        {rank}
      </div>
      <Avatar seed={user.avatarSeed || user.username} src={user.avatarUrl} size={48} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-black text-viet-text">{user.username}</h4>
          <OnlineBadge user={user} t={t} compactOnMobile />
        </div>
        <p className="mt-0.5 truncate text-[11px] font-bold text-[#70786e]">
          {t('home.leaderboard.level')} {user.level || 1} · {formatStudyTime(user.activeMinutes)}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[0.1em] text-[#667064]">
          <span>{t('home.leaderboard.comparison_label')}</span>
          <span>{progress}%</span>
        </div>
        <div
          className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e9ede5]"
          role="progressbar"
          aria-label={`${user.username}: ${formatNumber(user.xp)} XP`}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
          aria-valuetext={t('home.leaderboard.leader_comparison', { percent: progress })}
        >
          <div className="h-full rounded-full bg-viet-green" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="col-start-3 row-start-2 self-start font-rubik text-xl font-bold text-viet-text sm:col-start-4 sm:row-start-1 sm:self-center sm:text-right">
        {formatNumber(user.xp)} <span className="text-[10px] font-black text-[#43752f]">XP</span>
      </p>
    </motion.li>
  );
};

const LeaderboardSkeleton = ({ label }) => (
  <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]" role="status" aria-live="polite">
    <span className="sr-only">{label}</span>
    <div className="h-[330px] animate-pulse rounded-[32px] bg-[#dfe8dc] motion-reduce:animate-none" />
    <div className="grid gap-5">
      <div className="h-[155px] animate-pulse rounded-[28px] bg-white/80 motion-reduce:animate-none" />
      <div className="h-[155px] animate-pulse rounded-[28px] bg-white/80 motion-reduce:animate-none" />
    </div>
  </div>
);

const LeaderboardSection = () => {
  const { i18n, t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLeaders = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch('/api/user/leaderboard', { signal: controller.signal });
        if (!response.ok) throw new Error(`Leaderboard request failed: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Leaderboard response is not an array');

        const now = Date.now();
        const normalizedLeaders = data
          .filter((user) => Number(user?.xp) > 0)
          .map((user) => ({
            ...user,
            xp: Number(user.xp) || 0,
            computedIsOnline: Boolean(
              user?.isOnline
              || (user?.lastActiveAt && new Date(user.lastActiveAt).getTime() > now - 5 * 60 * 1000)
            ),
          }))
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 5);

        setLeaders(normalizedLeaders);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.error('Leaderboard fetch error:', fetchError);
          setLeaders([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchLeaders();
    return () => controller.abort();
  }, [requestVersion]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language || 'vi'),
    [i18n.language, i18n.resolvedLanguage],
  );

  const formatNumber = (value) => numberFormatter.format(Number(value) || 0);
  const formatStudyTime = (minutes) => {
    const totalMinutes = Math.max(0, Number(minutes) || 0);
    if (totalMinutes === 0) return t('home.leaderboard.no_activity');

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    if (hours === 0) return `${remainingMinutes}${t('home.leaderboard.minute_short')}`;
    if (remainingMinutes === 0) return `${hours}${t('home.leaderboard.hour_short')}`;
    return `${hours}${t('home.leaderboard.hour_short')} ${remainingMinutes}${t('home.leaderboard.minute_short')}`;
  };

  const champion = leaders[0];
  const runnersUp = leaders.slice(1, 3);
  const remainingLeaders = leaders.slice(3, 5);

  return (
    <section className="relative isolate overflow-hidden border-y border-[#dfe4d8] bg-[#f5f7f1] py-20 sm:py-24" aria-labelledby="leaderboard-title">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
        <div className="mb-10 flex flex-col gap-7 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#cfe1c3] bg-white px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#3f7427]">
              <Award size={15} aria-hidden="true" />
              {t('home.leaderboard.badge')}
            </span>
            <h2 id="leaderboard-title" className="mt-5 font-rubik text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-viet-text sm:text-5xl lg:text-[56px]">
              <span className="block">{t('home.leaderboard.title_main')}</span>
              <span className="mt-1 block max-w-[260px] text-[#4f8f35] sm:max-w-none">{t('home.leaderboard.title_highlight')}</span>
            </h2>
            <p className="mt-4 max-w-[650px] text-base font-semibold leading-7 text-viet-text-light sm:text-lg">
              {t('home.leaderboard.subtitle')}
            </p>
          </div>

          <div className="lg:pb-1">
            <Link
              to="/classroom"
              className="group inline-flex items-center gap-3 rounded-2xl border-b-4 border-[#0d241e] bg-[#173c31] px-5 py-3.5 text-sm font-black text-white transition-[transform,background-color,border-color] hover:-translate-y-0.5 hover:bg-[#255342] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#43752f] focus-visible:ring-offset-2 active:translate-y-1 active:border-b-0 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {t('home.leaderboard.conquer_btn')}
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {loading && <LeaderboardSkeleton label={t('home.leaderboard.transmitting')} />}

        {!loading && error && (
          <div className="rounded-[28px] border-2 border-[#dfe3db] border-b-[6px] bg-white px-6 py-14 text-center" role="alert" aria-live="assertive">
            <Trophy size={38} className="mx-auto text-viet-text-light/35" aria-hidden="true" />
            <p className="mt-4 font-bold text-viet-text-light">{t('home.leaderboard.load_error')}</p>
            <button
              type="button"
              onClick={() => setRequestVersion((version) => version + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-[#dfe3db] border-b-4 bg-[#f7f9f4] px-4 py-2.5 text-sm font-black text-viet-text transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#43752f] focus-visible:ring-offset-2 active:translate-y-0.5 active:border-b-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <RotateCcw size={15} aria-hidden="true" /> {t('home.leaderboard.retry')}
            </button>
          </div>
        )}

        {!loading && !error && leaders.length === 0 && (
          <div className="rounded-[28px] border-2 border-dashed border-[#cfd8c8] bg-white/75 px-6 py-14 text-center" role="status" aria-live="polite">
            <Award size={40} className="mx-auto text-viet-green/50" aria-hidden="true" />
            <p className="mx-auto mt-4 max-w-md font-bold text-viet-text-light">{t('home.leaderboard.empty')}</p>
          </div>
        )}

        {!loading && !error && champion && (
          <>
            <div className={`grid items-start gap-5 ${runnersUp.length > 1 ? 'lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]' : ''}`}>
              <ChampionCard
                user={champion}
                formatNumber={formatNumber}
                formatStudyTime={formatStudyTime}
                reducedMotion={reducedMotion}
                t={t}
              />
              {runnersUp.length > 0 && (
                <div className={`grid gap-5 ${runnersUp.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-1' : ''}`}>
                  {runnersUp.map((user, index) => (
                    <RunnerUpCard
                      key={`${user.username}-${index + 2}`}
                      rank={index + 2}
                      user={user}
                      formatNumber={formatNumber}
                      formatStudyTime={formatStudyTime}
                      reducedMotion={reducedMotion}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>

            {remainingLeaders.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-[28px] border-2 border-[#dfe3db] border-b-[6px] bg-white">
                <div className="border-b border-[#e8ece5] px-5 py-5 sm:px-6">
                  <div>
                    <h3 className="font-rubik text-xl font-bold text-viet-text">
                      {t('home.leaderboard.next_title')}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-viet-text-light">
                      {t('home.leaderboard.next_desc')}
                    </p>
                  </div>
                </div>
                <ol className="divide-y divide-[#edf0e9]" start={4}>
                  {remainingLeaders.map((user, index) => (
                    <RankingRow
                      key={`${user.username}-${index + 4}`}
                      rank={index + 4}
                      user={user}
                      topXp={champion.xp}
                      formatNumber={formatNumber}
                      formatStudyTime={formatStudyTime}
                      reducedMotion={reducedMotion}
                      t={t}
                    />
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default LeaderboardSection;
