import sys

with open('src/components/arena/ArenaBattleRoom.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

idx1 = content.find('const BalancingScaleModel =')
if idx1 == -1: sys.exit('BalancingScaleModel not found')
idx2 = content.find('const CalculationGame =', idx1)
if idx2 == -1: sys.exit('CalculationGame not found')

scale_model_new = """const BalancingScaleModel = ({ reactantCounts = {}, productCounts = {}, elements = [] }) => {
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

"""

new_content = content[:idx1] + scale_model_new + content[idx2:]
with open('src/components/arena/ArenaBattleRoom.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Replaced successfully')
