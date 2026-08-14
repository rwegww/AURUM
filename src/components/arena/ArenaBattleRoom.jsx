import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FlaskConical,
  Loader2,
  LogOut,
  Minus,
  Play,
  Plus,
  RefreshCw,
  Send,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import AtomicModel from '@/components/common/AtomicModel';

const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Server error');
  return data;
};

const GAME_META = {
  calculation: { label: 'Tính toán', icon: Calculator, tone: 'text-blue-300', bg: 'bg-blue-500/15' },
  balancing: { label: 'Cân bằng', icon: FlaskConical, tone: 'text-viet-green', bg: 'bg-viet-green/15' },
  atom_match: { label: 'Ghép nguyên tử', icon: Atom, tone: 'text-amber-300', bg: 'bg-amber-500/15' },
  electron_match: { label: 'Ghép electron', icon: Atom, tone: 'text-fuchsia-300', bg: 'bg-fuchsia-500/15' },
};

const parseNumber = (value) => Number(String(value).replace(',', '.'));

const parseFormula = (formula = '') => {
  const counts = {};
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match = regex.exec(formula);
  while (match) {
    const element = match[1];
    const count = Number(match[2] || 1);
    counts[element] = (counts[element] || 0) + count;
    match = regex.exec(formula);
  }
  return counts;
};

const sideAtomCounts = (formulas, coefficients) => {
  const total = {};
  formulas.forEach((formula, index) => {
    const coeff = Number(coefficients[index] || 1);
    const counts = parseFormula(formula);
    Object.entries(counts).forEach(([element, count]) => {
      total[element] = (total[element] || 0) + count * coeff;
    });
  });
  return total;
};

const SubmitButton = ({ disabled, submitting, onClick, label = 'Nộp đáp án' }) => (
  <button
    type="button"
    disabled={disabled || submitting}
    onClick={onClick}
    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-viet-green px-5 text-sm font-black uppercase tracking-widest text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
    {label}
  </button>
);

const inferCalculationVisual = (payload = {}) => {
  if (payload.visual) return payload.visual;
  const formula = String(payload.formula || '').toLowerCase();
  if (formula.includes('22,4') || formula.includes('22.4')) return 'gas';
  if (formula.includes('m / m') || formula.includes('m/m')) return 'scale';
  return 'flask';
};

const symbolFromLabel = (label = '') => {
  const match = String(label).match(/\(([^)]+)\)/);
  return match?.[1] || label;
};

const calculationStages = (payload = {}) => {
  const targetLabel = payload.target?.label || 'kết quả';
  const givenLabels = (payload.given || []).map((item) => item.label || '');
  const gasLabel = givenLabels.find((label) => /^V\(/.test(label));
  const formula = String(payload.formula || '');

  if (gasLabel && formula.includes('22')) {
    return [
      { title: `Tính n(${symbolFromLabel(gasLabel)})`, caption: 'Giai đoạn 1/2' },
      { title: `Tính ${targetLabel}`, caption: 'Giai đoạn 2/2' },
    ];
  }

  return [{ title: `Tính ${targetLabel}`, caption: 'Giai đoạn 1' }];
};

const CalculationFormulaModel = ({ payload = {}, value, setValue, disabled, submitting, canSubmit, onSubmit }) => {
  const stages = calculationStages(payload);

  return (
    <div data-arena-model="formula-calculator" className="rounded-lg border border-slate-200 bg-white p-5 text-viet-text">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {(payload.given || []).map((item) => (
          <div key={`${item.label}-${item.value}`} className="rounded-lg border border-viet-border bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{item.label}</p>
            <p className="mt-1 text-xl font-black text-viet-text">{item.value} {item.unit}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-viet-green/40 bg-viet-green/5 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">Công thức gợi ý</p>
        <p className="mt-2 text-xl font-black text-viet-text">{payload.formula || 'Chọn công thức phù hợp rồi tính kết quả'}</p>
      </div>

      <div data-arena-model="experiment-controls" className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3">
          {stages.map((stage, index) => (
            <div key={stage.title} className="rounded-lg border border-white bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">{stage.caption}</p>
              <p className="mt-1 text-sm font-black text-viet-text">{stage.title}</p>
              {index === 0 && stages.length > 1 && (
                <p className="mt-2 text-[11px] font-bold text-viet-text-light">V mol đktc = 22,4 L/mol</p>
              )}
            </div>
          ))}
        </div>

        {stages.length > 1 && (
          <button type="button" className="mt-3 rounded-lg border border-viet-green/30 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-viet-green">
            Sang giai đoạn 2
          </button>
        )}
      </div>

      <label className="mt-5 block">
        <span className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">
          {payload.target?.label || 'Kết quả'} {payload.target?.unit ? `(${payload.target.unit})` : ''}
        </span>
        <input
          type="number"
          step="any"
          value={value}
          disabled={disabled || submitting}
          onChange={(event) => setValue(event.target.value)}
          className="mt-2 min-h-14 w-full rounded-lg border border-viet-border px-4 text-2xl font-black outline-none transition focus:border-viet-green focus:ring-4 focus:ring-viet-green/10"
          placeholder="0.00"
        />
      </label>

      <div className="mt-5">
        <SubmitButton
          disabled={!canSubmit || disabled}
          submitting={submitting}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

const CalculationExperimentModel = ({ payload = {} }) => {
  const visual = inferCalculationVisual(payload);
  const given = payload.given || [];
  const visualMeta = {
    scale: {
      title: 'Cân điện tử',
      hint: 'Đưa khối lượng và khối lượng mol vào công thức.',
    },
    gas: {
      title: 'Thu khí ở nước',
      hint: 'Đổi thể tích khí sang mol bằng 22,4 lít/mol.',
    },
    flask: {
      title: 'Bình phản ứng',
      hint: 'Dùng tỉ lệ phương trình để suy ra chất cần tính.',
    },
    'heated-tube': {
      title: 'Ống nghiệm nung',
      hint: 'Nhiệt phân sinh khí rồi đổi mol sang thể tích.',
    },
  };
  const meta = visualMeta[visual] || visualMeta.flask;

  return (
    <div data-arena-model="calculation-experiment" className="rounded-2xl border border-slate-200 bg-white p-6 text-viet-text shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Mô hình thí nghiệm</p>
          <p className="font-black text-lg">{meta.title}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="relative min-h-[190px] overflow-hidden rounded-xl bg-slate-900/5 p-4 ring-1 ring-inset ring-slate-200/50">
          {visual === 'scale' && (
            <div className="grid h-full min-h-[160px] place-items-center">
              <div className="relative h-32 w-56">
                <div className="absolute left-1/2 top-8 h-20 w-2 -translate-x-1/2 rounded-full bg-white/30" />
                <div className="absolute left-1/2 top-5 h-2 w-44 -translate-x-1/2 rounded-full bg-viet-green" />
                <div className="absolute left-5 top-10 h-12 w-20 rounded-b-full border-2 border-blue-200/70 bg-blue-300/10 text-center text-[11px] font-black text-blue-100">
                  Mẫu cân
                </div>
                <div className="absolute right-5 top-10 h-12 w-20 rounded-b-full border-2 border-amber-200/70 bg-amber-300/10 text-center text-[11px] font-black text-amber-100">
                  M
                </div>
                <div className="absolute bottom-0 left-1/2 h-4 w-28 -translate-x-1/2 rounded-t-lg bg-white/20" />
              </div>
            </div>
          )}

          {visual === 'gas' && (
            <div className="grid h-full min-h-[160px] place-items-center">
              <div className="relative h-36 w-56">
                <div className="absolute bottom-0 left-0 right-0 h-12 rounded-lg border border-blue-200/30 bg-blue-300/20" />
                <div className="absolute bottom-8 left-16 h-28 w-20 rounded-t-full border-2 border-blue-200/70 bg-blue-200/10" />
                <div className="absolute bottom-10 left-20 h-20 w-12 rounded-t-full bg-viet-green/30" />
                <div className="absolute bottom-4 right-8 flex gap-1">
                  <span className="h-3 w-3 animate-bounce rounded-full bg-blue-200/80" style={{ animationDelay: '0ms' }} />
                  <span className="mt-4 h-2 w-2 animate-bounce rounded-full bg-blue-200/70" style={{ animationDelay: '150ms' }} />
                  <span className="mt-1 h-4 w-4 animate-bounce rounded-full bg-blue-200/60" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {visual === 'heated-tube' && (
            <div className="grid h-full min-h-[160px] place-items-center">
              <div className="relative h-36 w-60">
                <div className="absolute left-10 top-8 h-14 w-36 rotate-[-10deg] rounded-full border-2 border-white/50 bg-white/10" />
                <div className="absolute left-24 top-20 h-10 w-10 rounded-t-full bg-orange-400/80" />
                <div className="absolute left-28 top-14 h-14 w-5 rounded-t-full bg-red-400/80" />
                <div className="absolute right-4 top-6 flex gap-1">
                  <span className="h-3 w-3 animate-bounce rounded-full bg-sky-200/80" style={{ animationDelay: '0ms' }} />
                  <span className="mt-5 h-2 w-2 animate-bounce rounded-full bg-sky-200/70" style={{ animationDelay: '150ms' }} />
                  <span className="mt-2 h-4 w-4 animate-bounce rounded-full bg-sky-200/60" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {!['scale', 'gas', 'heated-tube'].includes(visual) && (
            <div className="grid h-full min-h-[160px] place-items-center text-center">
              <div>
                <FlaskConical className="mx-auto h-20 w-20 text-viet-green" />
                <div className="mt-3 flex justify-center gap-2">
                  <span className="h-3 w-3 animate-bounce rounded-full bg-red-300" style={{ animationDelay: '0ms' }} />
                  <span className="h-3 w-3 animate-bounce rounded-full bg-blue-300" style={{ animationDelay: '150ms' }} />
                  <span className="h-3 w-3 animate-bounce rounded-full bg-viet-green" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl border border-viet-green/30 bg-viet-green/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">Công thức tương ứng</p>
          <p className="mt-1 text-sm font-black text-viet-text">{payload.formula || meta.hint}</p>
          <p className="mt-2 text-xs font-bold text-viet-text-light">{meta.hint}</p>
        </div>

        {given.length > 0 && (
          <div className="mt-4 grid gap-2">
            {given.map((item) => (
              <div key={`${item.label}-${item.value}-${item.unit}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black shadow-sm">
                <span className="text-viet-text-light">{item.label}</span>
                <span className="text-viet-text">{item.value} {item.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BalancingScaleModel = ({ reactantCounts = {}, productCounts = {}, elements = [] }) => {
  const leftTotal = elements.reduce((sum, element) => sum + Number(reactantCounts[element] || 0), 0);
  const rightTotal = elements.reduce((sum, element) => sum + Number(productCounts[element] || 0), 0);
  const isBalanced = elements.length > 0 && elements.every((element) => reactantCounts[element] === productCounts[element]);
  const tilt = isBalanced ? 0 : Math.max(-10, Math.min(10, (rightTotal - leftTotal) * 2));

  return (
    <div data-arena-model="balancing-scale" className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 text-viet-text shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">Cái cân cân bằng</p>
          <p className="mt-1 text-lg font-black text-viet-text">{isBalanced ? 'Hai vế đã bằng nhau' : 'Chỉnh hệ số để cân bằng'}</p>
        </div>
        <div className={`rounded-xl px-4 py-2 font-mono text-sm font-black shadow-sm ${isBalanced ? 'bg-viet-green/10 text-viet-green ring-1 ring-viet-green/30' : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'}`}>
          {leftTotal} / {rightTotal}
        </div>
      </div>

      <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-viet-border bg-slate-50 p-4 shadow-inner">
        <div className="absolute bottom-6 left-1/2 h-40 w-3 -translate-x-1/2 rounded-full border border-slate-300 bg-gradient-to-b from-slate-200 to-slate-400 shadow-md" />
        <div className="absolute bottom-4 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full border border-slate-300 bg-slate-400 shadow-[0_10px_20px_rgba(0,0,0,0.1)]" />

        <div
          className="absolute left-8 right-8 top-16 h-2.5 origin-center rounded-full bg-gradient-to-r from-viet-green to-lime-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          <div className="absolute -left-6 top-3 w-32" style={{ transform: `rotate(${-tilt}deg)`, transition: 'transform 500ms ease-out' }}>
            <div className="relative overflow-hidden rounded-b-[40px] border-2 border-emerald-200 bg-emerald-50 px-3 py-6 text-center shadow-md">
              <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Vế trái</p>
              <p className="relative mt-2 font-mono text-4xl font-black text-emerald-500">{leftTotal}</p>
            </div>
          </div>
          <div className="absolute -right-6 top-3 w-32" style={{ transform: `rotate(${-tilt}deg)`, transition: 'transform 500ms ease-out' }}>
            <div className="relative overflow-hidden rounded-b-[40px] border-2 border-amber-200 bg-amber-50 px-3 py-6 text-center shadow-md">
              <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Vế phải</p>
              <p className="relative mt-2 font-mono text-4xl font-black text-amber-500">{rightTotal}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-2">
          {elements.map((element) => {
            const ok = reactantCounts[element] === productCounts[element];
            return (
              <span key={element} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black tracking-wider ${ok ? 'border-viet-green/30 bg-viet-green/10 text-viet-green' : 'border-red-400/30 bg-red-50 text-red-500'}`}>
                {element}: {reactantCounts[element] || 0}/{productCounts[element] || 0}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalculationGame = ({ task, onSubmit, submitting, disabled }) => {
  const [value, setValue] = useState('');
  const payload = task.payload || {};

  const numberValue = parseNumber(value);
  const canSubmit = Number.isFinite(numberValue);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <CalculationFormulaModel
        payload={payload}
        value={value}
        setValue={setValue}
        disabled={disabled}
        submitting={submitting}
        canSubmit={canSubmit}
        onSubmit={() => onSubmit({ gameType: 'calculation', value: numberValue })}
      />

      <CalculationExperimentModel payload={payload} />
    </div>
  );
};

const BalancingGame = ({ task, onSubmit, submitting, disabled }) => {
  const equation = task.payload?.equation || { reactants: [], products: [] };
  const formulas = [...(equation.reactants || []), ...(equation.products || [])];
  const splitIndex = equation.reactants?.length || 0;
  const min = Number(task.payload?.minCoefficient || 1);
  const max = Number(task.payload?.maxCoefficient || 12);
  const [coefficients, setCoefficients] = useState(() => formulas.map(() => 1));

  const reactantCounts = useMemo(
    () => sideAtomCounts(equation.reactants || [], coefficients.slice(0, splitIndex)),
    [coefficients, equation.reactants, splitIndex],
  );
  const productCounts = useMemo(
    () => sideAtomCounts(equation.products || [], coefficients.slice(splitIndex)),
    [coefficients, equation.products, splitIndex],
  );
  const elements = useMemo(
    () => Array.from(new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)])).sort(),
    [reactantCounts, productCounts],
  );
  const isBalanced = elements.length > 0 && elements.every((element) => reactantCounts[element] === productCounts[element]);

  const changeCoeff = (index, delta) => {
    setCoefficients((current) => current.map((value, i) => (
      i === index ? Math.max(min, Math.min(max, value + delta)) : value
    )));
  };

  const renderFormula = (formula, index) => (
    <div key={`${formula}-${index}`} className="flex shrink-0 items-center gap-2 rounded-xl border border-viet-border bg-slate-50 px-3 py-2 shadow-sm transition-all focus-within:border-viet-green/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-viet-green/10">
      <div className="flex items-center gap-1 rounded-md border border-viet-border bg-white p-0.5">
        <button
          type="button"
          disabled={disabled || submitting || coefficients[index] <= min}
          onClick={() => changeCoeff(index, -1)}
          className="flex h-6 w-6 items-center justify-center rounded text-viet-text-light transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center font-mono text-lg font-black text-viet-green">{coefficients[index]}</span>
        <button
          type="button"
          disabled={disabled || submitting || coefficients[index] >= max}
          onClick={() => changeCoeff(index, 1)}
          className="flex h-6 w-6 items-center justify-center rounded text-viet-text-light transition hover:bg-viet-green/10 hover:text-viet-green disabled:opacity-30"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <span className="text-xl font-black text-viet-text">{formula}</span>
    </div>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-viet-text shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          {(equation.reactants || []).map((formula, index) => (
            <React.Fragment key={`reactant-${formula}-${index}`}>
              {renderFormula(formula, index)}
              {index < splitIndex - 1 && <span className="shrink-0 text-xl font-black text-viet-text-light drop-shadow-sm">+</span>}
            </React.Fragment>
          ))}
          <span className="shrink-0 mx-1 text-2xl font-black text-viet-green drop-shadow-sm">{'->'}</span>
          {(equation.products || []).map((formula, index) => (
            <React.Fragment key={`product-${formula}-${index}`}>
              {renderFormula(formula, splitIndex + index)}
              {index < equation.products.length - 1 && <span className="shrink-0 text-xl font-black text-viet-text-light drop-shadow-sm">+</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-viet-border shadow-sm">
          <div className="grid grid-cols-3 bg-slate-50 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-viet-text-light">
            <span>Nguyên tố</span>
            <span className="text-center">Vế trái</span>
            <span className="text-center">Vế phải</span>
          </div>
          {elements.map((element) => {
            const ok = reactantCounts[element] === productCounts[element];
            return (
              <div key={element} className="grid grid-cols-3 border-t border-viet-border bg-white px-5 py-4 text-base font-black transition-colors hover:bg-slate-50">
                <span className={ok ? 'text-viet-green' : 'text-red-500'}>{element}</span>
                <span className="text-center text-viet-text">{reactantCounts[element] || 0}</span>
                <span className="text-center text-viet-text">{productCounts[element] || 0}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black shadow-sm ${isBalanced ? 'bg-viet-green/10 text-viet-green ring-1 ring-viet-green/30' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20'}`}>
            {isBalanced ? <CheckCircle2 className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
            {isBalanced ? 'Các nguyên tố đã cân bằng' : 'Theo dõi bộ đếm nguyên tử'}
          </div>
          <SubmitButton
            disabled={disabled}
            submitting={submitting}
            onClick={() => onSubmit({ gameType: 'balancing', value: coefficients })}
          />
        </div>
      </div>

      <BalancingScaleModel reactantCounts={reactantCounts} productCounts={productCounts} elements={elements} />
    </div>
  );
};

const AtomMatchGame = ({ task, onSubmit, submitting, disabled }) => {
  const payload = task.payload || {};
  const slots = payload.slots || [];
  const choices = payload.choices || [];
  const [placements, setPlacements] = useState({});
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const placeAtom = (slotId, symbol) => {
    if (!symbol || disabled || submitting) return;
    setPlacements((current) => ({ ...current, [slotId]: symbol }));
    setSelected(null);
    setDragging(null);
    setDragOverSlot(null);
  };

  const filledCount = slots.filter((slot) => placements[slot.id]).length;
  const filled = slots.length > 0 && slots.every((slot) => placements[slot.id]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-viet-text">
        <div data-arena-model="atom-drag-drop" className="rounded-lg border border-viet-border bg-slate-50 p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">Kéo thả nguyên tử</p>
              <p className="text-xl font-black text-viet-text">{payload.formula || 'Molecule'}</p>
            </div>
            <span className="rounded-lg bg-white px-3 py-2 text-xs font-black text-viet-text-light">
              {filledCount}/{slots.length} vị trí
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {choices.map((choice) => (
              <button
                key={choice.symbol}
                type="button"
                draggable={!disabled && !submitting}
                disabled={disabled || submitting}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', choice.symbol);
                  event.dataTransfer.effectAllowed = 'copy';
                  setDragging(choice.symbol);
                }}
                onDragEnd={() => {
                  setDragging(null);
                  setDragOverSlot(null);
                }}
                onClick={() => setSelected(choice.symbol)}
                className={`min-h-16 cursor-grab rounded-lg border px-4 text-left transition active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected === choice.symbol || dragging === choice.symbol
                    ? 'border-viet-green bg-viet-green/10 shadow-sm shadow-viet-green/20'
                    : 'border-viet-border bg-white hover:border-viet-green/50'
                }`}
              >
                <span className="text-2xl font-black text-viet-text">{choice.symbol}</span>
                <span className="ml-2 text-xs font-bold text-viet-text-light">{choice.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-dashed border-viet-green/40 bg-viet-green/5 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-viet-green">Khung phân tử</p>
            <p className="text-xs font-bold text-viet-text-light">Kéo thẻ vào từng ô hoặc chọn thẻ rồi bấm ô</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                role="button"
                tabIndex={disabled || submitting ? -1 : 0}
                onClick={() => selected && placeAtom(slot.id, selected)}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && selected) {
                    event.preventDefault();
                    placeAtom(slot.id, selected);
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'copy';
                }}
                onDragEnter={() => setDragOverSlot(slot.id)}
                onDragLeave={() => setDragOverSlot((current) => (current === slot.id ? null : current))}
                onDrop={(event) => {
                  event.preventDefault();
                  placeAtom(slot.id, event.dataTransfer.getData('text/plain'));
                }}
                className={`min-h-32 rounded-lg border-2 border-dashed p-4 text-left transition ${
                  dragOverSlot === slot.id
                    ? 'border-viet-green bg-viet-green/15 ring-4 ring-viet-green/10'
                    : placements[slot.id]
                      ? 'border-viet-green bg-white'
                      : 'border-viet-border bg-white/70 hover:border-viet-green/60'
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">{slot.label}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl font-black ${
                    placements[slot.id]
                      ? 'border-viet-green bg-viet-green text-white'
                      : 'border-viet-border bg-slate-50 text-viet-text-light'
                  }`}
                  >
                    {placements[slot.id] || '+'}
                  </span>
                  <div>
                    <p className="text-sm font-black text-viet-text">{placements[slot.id] || 'Đang trống'}</p>
                    <p className="mt-1 text-xs font-bold text-viet-text-light">{slot.hint || 'Thả nguyên tử vào đây'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <SubmitButton
            disabled={!filled || disabled}
            submitting={submitting}
            onClick={() => onSubmit({ gameType: 'atom_match', value: placements })}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-viet-text shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Trạng thái phân tử</p>
        <p className="mt-2 text-3xl font-black text-viet-green">{payload.formula || 'Molecule'}</p>
        <div className="mt-5 grid min-h-[240px] place-items-center rounded-2xl border border-viet-border bg-slate-50 p-4">
          <div className="flex max-w-[260px] flex-wrap justify-center gap-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-black ${
                  placements[slot.id]
                    ? 'border-viet-green bg-viet-green text-white shadow-md'
                    : 'border-slate-200 bg-white text-viet-text-light'
                }`}
              >
                {placements[slot.id] || '?'}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          Đã ghép {filledCount}/{slots.length} vị trí. Đáp án chỉ được chấm ở backend.
        </div>
      </div>
    </div>
  );
};

const ElectronMatchGame = ({ task, onSubmit, submitting, disabled }) => {
  const payload = task.payload || {};
  const labels = payload.shellLabels || ['K', 'L', 'M'];
  const [shells, setShells] = useState(() => labels.map(() => 0));

  const total = shells.reduce((sum, value) => sum + Number(value || 0), 0);
  const target = Number(payload.atomicNumber || 0);
  const canSubmit = target > 0 && total === target;

  const capacity = (index) => 2 * (index + 1) * (index + 1);
  const changeShell = (index, delta) => {
    setShells((current) => current.map((value, i) => {
      if (i !== index) return value;
      return Math.max(0, Math.min(capacity(index), value + delta));
    }));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-viet-text">
        <div className="mb-5 rounded-lg border border-viet-border bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Nguyên tử</p>
          <p className="mt-1 text-3xl font-black text-viet-text">{payload.symbol} <span className="text-base text-viet-text-light">Z = {target}</span></p>
          <p className="mt-2 text-sm font-bold text-viet-text-light">{payload.modelHint}</p>
        </div>

        <div className="grid gap-3">
          {labels.map((label, index) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-viet-border p-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Lớp {label}</p>
                <p className="text-sm font-bold text-viet-text-light">Tối đa {capacity(index)} electron</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={disabled || submitting || shells[index] <= 0}
                  onClick={() => changeShell(index, -1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-viet-border text-xl font-black transition hover:bg-red-50 disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-10 text-center text-2xl font-black text-viet-green">{shells[index]}</span>
                <button
                  type="button"
                  disabled={disabled || submitting || shells[index] >= capacity(index)}
                  onClick={() => changeShell(index, 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-viet-border text-xl font-black transition hover:bg-viet-green/10 disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className={`rounded-lg px-3 py-2 text-sm font-black ${canSubmit ? 'bg-viet-green/10 text-viet-green' : 'bg-amber-50 text-amber-600'}`}>
            Tổng electron: {total}/{target}
          </div>
          <SubmitButton
            disabled={!canSubmit || disabled}
            submitting={submitting}
            onClick={() => onSubmit({ gameType: 'electron_match', value: shells })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <AtomicModel shells={shells} symbol={payload.symbol || ''} />
      </div>
    </div>
  );
};

const MiniGameRenderer = React.memo(({ task, onSubmit, submitting, disabled }) => {
  if (!task) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-viet-text shadow-sm">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-viet-green" />
        <span className="font-black">Đang tải nhiệm vụ...</span>
      </div>
    );
  }

  const props = { task, onSubmit, submitting, disabled };
  switch (task.gameType) {
    case 'calculation':
      return <CalculationGame key={task.id} {...props} />;
    case 'balancing':
      return <BalancingGame key={task.id} {...props} />;
    case 'atom_match':
      return <AtomMatchGame key={task.id} {...props} />;
    case 'electron_match':
      return <ElectronMatchGame key={task.id} {...props} />;
    default:
      return (
        <div className="rounded-lg border border-white/10 bg-white p-8 text-center text-viet-text">
          <XCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          Chưa có renderer cho mini game này.
        </div>
      );
  }
});

const Scoreboard = React.memo(({ players, currentUserId }) => {
  const sortedPlayers = useMemo(() => [...players].sort((a, b) => (b.score || 0) - (a.score || 0)), [players]);
  return (
    <div className="flex w-full items-center gap-4 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 hide-scrollbar shadow-sm">
      <div className="flex shrink-0 items-center gap-2 border-r border-slate-200 pr-4">
        <Trophy className="h-4 w-4 text-amber-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Bảng điểm</span>
      </div>
      <div className="flex gap-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.nguoi_dung_id}
            className={`flex shrink-0 items-center gap-2.5 rounded-full border px-3 py-1.5 ${player.nguoi_dung_id === currentUserId ? 'border-viet-green/50 bg-viet-green/10' : 'border-slate-200 bg-slate-50'}`}
          >
            <span className="text-[10px] font-black text-viet-text-light">#{index + 1}</span>
            <Avatar seed={player.avatar_seed || player.username || 'Aurum'} size={24} />
            <span className="max-w-[100px] truncate text-xs font-bold text-viet-text">{player.username}</span>
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-viet-text-light" aria-label={`${player.correct_count || 0} câu đúng`}>
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                {player.correct_count || 0}
              </span>
              <span className="text-xs font-black text-viet-green">{player.score || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const WaitingRoom = ({ state, user, onStart, onLeave, onRefresh, refreshing, starting, feedback }) => {
  const room = state?.room || {};
  const players = state?.players || [];
  const isHost = room.chu_phong_id === user?.id;
  const canStart = isHost && (room.is_practice || players.length >= (room.max_players || 1));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 text-viet-text backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-viet-green">Phòng Arena PK</p>
              <h1 className="mt-2 text-4xl font-black">{room.name || `Phòng ${room.id}`}</h1>
              <p className="mt-2 text-sm font-bold text-viet-text-light">Mã phòng: <span className="text-viet-text">{room.id}</span></p>
            </div>
            <button
              type="button"
              onClick={onLeave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-black uppercase tracking-widest text-red-500 transition hover:border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Rời phòng
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Chế độ</p>
              <p className="mt-2 text-xl font-black">{room.mode || 'solo'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Độ khó</p>
              <p className="mt-2 text-xl font-black">{room.difficulty || 'auto'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Người chơi</p>
              <p className="mt-2 text-xl font-black">{players.length}/{room.max_players || 1}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {players.map((player) => (
              <div key={player.nguoi_dung_id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Avatar seed={player.avatar_seed || player.username || 'Aurum'} size={44} />
                <div className="min-w-0">
                  <p className="truncate font-black">{player.username}</p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-viet-text-light">{player.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-viet-text-light">
              {isHost ? 'Chủ phòng có thể bắt đầu khi đủ người.' : 'Đợi chủ phòng bắt đầu trận.'}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={refreshing || starting}
                onClick={onRefresh}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black uppercase tracking-widest text-viet-text-light transition hover:border-viet-green/40 hover:text-viet-green disabled:cursor-not-allowed disabled:opacity-60"
                title="Làm mới danh sách người chơi"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Đang tải' : 'Làm mới'}
              </button>
              <button
                type="button"
                disabled={!canStart || starting || refreshing}
                onClick={onStart}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-viet-green px-6 text-sm font-black uppercase tracking-widest text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
                Bắt đầu
              </button>
            </div>
          </div>
          {feedback?.message && (
            <p className={`mt-3 rounded-xl px-4 py-3 text-sm font-bold ${feedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-viet-green/10 text-viet-green'}`}>
              {feedback.message}
            </p>
          )}
        </div>
    </div>
  );
};

const FinishedRoom = ({ state, user, onContinue }) => {
  const players = [...(state?.players || [])].sort((a, b) => (b.score || 0) - (a.score || 0));
  const room = state?.room || {};
  const current = players.find((player) => player.nguoi_dung_id === user?.id);
  const result = room.nguoi_thang_id
    ? (room.nguoi_thang_id === user?.id ? 'win' : 'lose')
    : 'draw';

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-900/60 p-4 text-viet-text backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-viet-green/15 text-viet-green">
            <Trophy className="h-8 w-8" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">Trận đã kết thúc</p>
          <h1 className="mt-2 text-4xl font-black">
            {result === 'win' ? 'Bạn thắng' : result === 'lose' ? 'Bạn thua' : 'Hòa điểm'}
          </h1>
          <p className="mt-2 text-sm font-bold text-viet-text-light">Điểm của bạn: {current?.score || 0}</p>

          <div className="mt-6 space-y-3 text-left">
            {players.map((player, index) => (
              <div key={player.nguoi_dung_id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="w-6 text-center font-black text-viet-text-light">{index + 1}</span>
                <Avatar seed={player.avatar_seed || player.username || 'Aurum'} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{player.username}</p>
                  <p className="text-xs font-bold text-viet-text-light">{player.correct_count || 0} câu đúng</p>
                </div>
                <span className="font-black text-viet-green">{player.score || 0}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onContinue({ result, score: current?.score || 0 })}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-viet-green px-5 text-sm font-black uppercase tracking-widest text-white transition hover:brightness-105"
          >
            <Play className="h-5 w-5" />
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomTimer = React.memo(({ roundEndsAt, serverOffset, timeLimitSeconds, progress, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      if (!roundEndsAt) {
        setTimeLeft(0);
        return;
      }
      const serverNow = Date.now() + serverOffset;
      const next = Math.max(0, Math.ceil((new Date(roundEndsAt).getTime() - serverNow) / 1000));
      setTimeLeft(next);
      if (next <= 0 && onTimeUp) {
        onTimeUp();
      }
    };

    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [roundEndsAt, serverOffset, onTimeUp]);

  const timerPct = timeLimitSeconds ? Math.max(0, Math.min(100, (timeLeft / timeLimitSeconds) * 100)) : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-viet-text-light">
        <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Thời gian</span>
        <span className={timeLeft <= 5 ? 'text-red-500' : 'text-viet-green'}>{timeLeft}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-viet-green'}`}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-50">
        <div className="h-full rounded-full bg-slate-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
});

const ArenaBattleRoom = ({ user, room, onLeave, onMatchEnd }) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [phan_hoi, setFeedback] = useState(null);
  const [serverOffset, setServerOffset] = useState(0);
  const advanceLockRef = useRef(null);
  const refreshLockRef = useRef(false);
  const startLockRef = useRef(false);
  const stateRequestRef = useRef(0);

  const loadState = useCallback(async () => {
    const requestId = stateRequestRef.current + 1;
    stateRequestRef.current = requestId;
    const data = await apiCall(`/api/arena/room/${room.id}/state`, { cache: 'no-store' });
    if (requestId !== stateRequestRef.current) return null;
    if (!data.state?.room || String(data.state.room.id) !== String(room.id)) {
      throw new Error('Trạng thái phòng trả về không khớp mã phòng hiện tại.');
    }
    if (data.state?.serverTime) {
      setServerOffset(new Date(data.state.serverTime).getTime() - Date.now());
    }
    setState(data.state);
    return data.state;
  }, [room.id]);

  const refreshState = useCallback(async () => {
    if (refreshLockRef.current) return;
    refreshLockRef.current = true;
    setRefreshing(true);
    try {
      await loadState();
      setFeedback(null);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      refreshLockRef.current = false;
      setRefreshing(false);
    }
  }, [loadState]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadState()
      .catch((error) => setFeedback({ type: 'error', message: error.message }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
      stateRequestRef.current += 1;
    };
  }, [loadState]);

  // The authenticated API is the authoritative source for an Arena room.
  // A single guarded poll avoids Realtime/RLS token mismatches and rejects
  // out-of-order responses, so an older 1/2 response cannot overwrite 2/2.
  useEffect(() => {
    if (state?.room?.status === 'finished') return undefined;
    let active = true;
    let polling = false;

    const sync = async ({ force = false } = {}) => {
      if (!active || polling) return;
      if (!force && document.visibilityState === 'hidden') return;
      polling = true;
      try {
        await loadState();
      } catch (error) {
        console.warn('Arena sync error:', error.message);
      } finally {
        polling = false;
      }
    };

    const handleFocus = () => sync({ force: true });
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') sync({ force: true });
    };

    const pollInterval = setInterval(sync, 2000);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      active = false;
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadState, state?.room?.status]);

  const advanceRoom = useCallback(async () => {
    const currentRoom = state?.room;
    if (!currentRoom || currentRoom.status !== 'playing') return;
    if (currentRoom.chu_phong_id !== user?.id) return;
    const lockKey = `${currentRoom.id}-${currentRoom.current_round_index}`;
    if (advanceLockRef.current === lockKey) return;
    advanceLockRef.current = lockKey;
    try {
      const data = await apiCall(`/api/arena/room/${room.id}/advance`, { method: 'POST' });
      if (data.state) {
        stateRequestRef.current += 1;
        setState(data.state);
        setFeedback(null);
      } else {
        advanceLockRef.current = null;
      }
    } catch (error) {
      advanceLockRef.current = null;
      console.warn('Arena advance skipped:', error.message);
    }
  }, [room.id, state?.room, user?.id]);

  const startRoom = async () => {
    if (startLockRef.current) return;
    startLockRef.current = true;
    setStarting(true);
    setFeedback(null);
    try {
      const data = await apiCall(`/api/arena/room/${room.id}/start`, { method: 'POST' });
      if (data.state) {
        stateRequestRef.current += 1;
        setState(data.state);
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      startLockRef.current = false;
      setStarting(false);
    }
  };

  const submitAnswer = async (payload) => {
    const currentRoom = state?.room;
    if (!currentRoom || submitting) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const data = await apiCall(`/api/arena/room/${room.id}/answer`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setFeedback({
        type: data.isCorrect ? 'success' : 'error',
        message: data.isCorrect ? `Chính xác +${data.scoreAwarded}` : 'Chưa đúng, chờ hết lượt để xem đáp án.',
      });
      if (data.state) {
        stateRequestRef.current += 1;
        setState(data.state);
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const currentRoom = state?.room;
  const players = state?.players || [];
  const currentTask = state?.currentQuestion;
  const currentPlayer = players.find((player) => player.nguoi_dung_id === user?.id);
  const hasAnswered = (state?.myAnswers || []).some((answer) => answer.round_index === currentRoom?.current_round_index);
  const meta = GAME_META[currentTask?.gameType] || { label: 'Mini game', icon: FlaskConical, tone: 'text-viet-green', bg: 'bg-viet-green/15' };
  const MetaIcon = meta.icon;
  const totalRounds = currentRoom?.total_rounds || 1;
  const progress = currentRoom?.status === 'playing'
    ? Math.min(100, (((currentRoom.current_round_index || 0) + 1) / totalRounds) * 100)
    : 0;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-viet-green" />
          <p className="font-black">Đang tải phòng Arena...</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950 p-4 text-white">
        <div className="max-w-md rounded-lg border border-white/10 bg-white/5 p-6 text-center">
          <XCircle className="mx-auto mb-4 h-10 w-10 text-red-300" />
          <p className="font-black">Không tải được phòng Arena.</p>
          <button type="button" onClick={onLeave} className="mt-5 rounded-lg bg-viet-green px-5 py-3 font-black text-white">Quay lại</button>
        </div>
      </div>
    );
  }

  if (currentRoom?.status === 'waiting') {
    return <WaitingRoom state={state} user={user} onStart={startRoom} onLeave={onLeave} onRefresh={refreshState} refreshing={refreshing} starting={starting} feedback={phan_hoi} />;
  }

  if (currentRoom?.status === 'finished') {
    return (
      <FinishedRoom
        state={state}
        user={user}
        onContinue={({ result, score }) => onMatchEnd({
          result,
          score,
          phong_dau_id: currentRoom.id,
          isPractice: currentRoom.is_practice || room.isPractice,
          serverFinalized: true,
        })}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-50 p-4 text-viet-text sm:p-6">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-5">
        <header className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLeave}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-viet-text-light transition hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-sm"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Tiến độ</p>
              <p className="font-black">Round {(currentRoom?.current_round_index || 0) + 1}/{totalRounds}</p>
            </div>
          </div>

          <RoomTimer
            roundEndsAt={currentRoom?.status === 'playing' ? currentRoom?.round_ends_at : null}
            serverOffset={serverOffset}
            timeLimitSeconds={currentTask?.timeLimitSeconds}
            progress={progress}
            onTimeUp={advanceRoom}
          />

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-viet-text-light">Điểm</p>
              <p className="text-xl font-black text-viet-text">{currentPlayer?.score || 0}</p>
            </div>
            <Avatar
              seed={user?.avatarSeed || user?.username || 'Aurum'}
              size={48}
              streakCount={user?.streakCount}
              level={user?.level}
            />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-5">
          <Scoreboard players={players} currentUserId={user?.id} />

          <div className="flex-1 space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-widest ${meta.bg} ${meta.tone}`}>
                  <MetaIcon className="h-4 w-4" />
                  {meta.label}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-viet-text-light">{currentTask?.difficulty || currentRoom?.difficulty}</span>
              </div>
              <h1 className="text-2xl font-black leading-snug sm:text-3xl">{currentTask?.question}</h1>
            </section>

            {phan_hoi && (
              <div className={`rounded-lg border px-4 py-3 text-sm font-black ${phan_hoi.type === 'success' ? 'border-viet-green/40 bg-viet-green/10 text-viet-green' : 'border-red-400/30 bg-red-500/10 text-red-200'}`}>
                {phan_hoi.message}
              </div>
            )}

            {hasAnswered && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-black text-amber-700 shadow-sm">
                Bạn đã nộp round này. Đang chờ người chơi khác hoặc hết giờ.
              </div>
            )}

            <MiniGameRenderer
              task={currentTask}
              onSubmit={submitAnswer}
              submitting={submitting}
              disabled={hasAnswered || currentRoom?.status !== 'playing'}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export {
  MiniGameRenderer,
  CalculationGame,
  BalancingGame,
  AtomMatchGame,
  ElectronMatchGame,
};

export default ArenaBattleRoom;

