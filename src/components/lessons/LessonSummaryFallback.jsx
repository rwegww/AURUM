import React from 'react';
import { BookOpen, CheckCircle2, FlaskConical, Lightbulb, Target } from 'lucide-react';
import { getLessonSummary } from '@/utils/lessonSummary';

const LessonSummaryFallback = ({ lesson, pageNumber, compact = false }) => {
  const summary = getLessonSummary(lesson);
  const visibleConcepts = summary.concepts.length
    ? summary.concepts.slice(0, compact ? 3 : 4)
    : (summary.keywords.length ? summary.keywords : ['Kiến thức trọng tâm']).slice(0, compact ? 3 : 4).map((keyword) => ({
      title: keyword,
      description: 'Từ khóa cần ghi nhớ và liên hệ với ví dụ trong bài học.',
    }));
  const visibleGoals = (summary.goals.length ? summary.goals : ['Nắm ý chính, ghi lại ví dụ và hoàn thành nhiệm vụ kiểm tra.']).slice(0, compact ? 2 : 3);
  const visibleApplications = summary.applications.slice(0, compact ? 2 : 3);

  return (
    <div className={`w-full h-full bg-white ${compact ? 'p-5' : 'p-6 md:p-8'} flex flex-col overflow-hidden`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-viet-green text-[10px] font-black uppercase tracking-[2px] mb-2">
            <BookOpen size={14} />
            <span>{pageNumber ? `Trang ${pageNumber}` : 'Phiếu tổng kết'}</span>
          </div>
          <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-black text-viet-text leading-tight`}>
            {summary.title}
          </h3>
          {summary.chapter && (
            <p className="text-[11px] font-bold text-viet-text-light mt-1 line-clamp-1">
              {summary.chapter}
            </p>
          )}
        </div>
        <div className="shrink-0 px-3 py-2 rounded-2xl bg-viet-green/10 text-viet-green text-[10px] font-black uppercase tracking-widest border border-viet-green/20">
          Tạm thời
        </div>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-5'} flex-1 min-h-0 mt-5`}>
        <section className="min-h-0 flex flex-col">
          <div className="flex items-center gap-2 text-viet-text mb-3">
            <Target size={16} className="text-viet-green" />
            <h4 className="text-[12px] font-black uppercase tracking-widest">Trọng tâm cần nắm</h4>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
            {visibleConcepts.map((concept) => (
              <div key={concept.title} className="rounded-2xl border border-slate-200 bg-[#fcf8f0] p-4">
                <div className="text-[13px] font-black text-viet-text mb-1">{concept.title}</div>
                <p className="text-[12px] text-viet-text-light font-medium leading-relaxed">
                  {concept.description}
                </p>
                {concept.signal && (
                  <p className="text-[11px] text-viet-green font-bold mt-2 leading-relaxed">
                    Dấu hiệu: {concept.signal}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="min-h-0 flex flex-col gap-4">
          {visibleGoals.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} className="text-viet-green" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-viet-text">Mục tiêu</h4>
              </div>
              <ul className="space-y-2">
                {visibleGoals.map((goal) => (
                  <li key={goal} className="text-[11.5px] text-viet-text-light font-medium leading-relaxed line-clamp-2">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {visibleApplications.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-sky-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={15} className="text-sky-600" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Vận dụng</h4>
              </div>
              <ul className="space-y-2">
                {visibleApplications.map((item) => (
                  <li key={item} className="text-[11.5px] text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-viet-green/20 bg-viet-green/5 p-4 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical size={15} className="text-viet-green" />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-viet-text">Nhiệm vụ</h4>
            </div>
            <p className="text-[12px] text-viet-text-light font-bold leading-relaxed">
              {summary.lab.title}
            </p>
            <div className="flex gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-full bg-white border border-viet-green/15 text-[10px] font-black text-viet-green">
                {summary.challengeCount} thử thách
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-viet-green/15 text-[10px] font-black text-viet-green">
                {summary.quizCounts.level1 + summary.quizCounts.level2 + summary.quizCounts.level3} câu hỏi
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonSummaryFallback;
