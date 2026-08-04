import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Check,
  Diamond,
  Flame,
  Leaf,
  Lock,
  Microscope,
  Plus,
  Search,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { molecules } from '../../data/molecules';
import { elements } from '../../data/elements';
import { craftableItems } from '../../data/labInventory';
import { getChemicalImage } from '../../data/chemicalImages';
import { calculateMolarMass } from '../../utils/labChemistry';

const normalize = (formula) => {
  if (!formula) return '';
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return formula.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match]).trim().toUpperCase();
};

const getApplications = (formula, category) => {
  const applications = {
    H2O: 'Sự sống, dung môi, làm mát và nhiều quy trình công nghiệp.',
    NACL: 'Gia vị, bảo quản thực phẩm và sản xuất xút – clo.',
    CO2: 'Chữa cháy, bảo quản thực phẩm và sản xuất nước giải khát.',
    O2: 'Hô hấp, y tế, luyện kim và nhiên liệu tên lửa.',
    H2: 'Nhiên liệu sạch và nguyên liệu sản xuất amoniac.',
    H2SO4: 'Sản xuất phân bón, chất tẩy rửa và ắc quy chì.',
    NAOH: 'Sản xuất xà phòng, giấy và xử lý nước thải.',
    FE3O4: 'Sản xuất nam châm, sơn chống gỉ và linh kiện điện tử.',
    HCL: 'Tẩy gỉ thép, điều chỉnh pH và sản xuất hóa chất.',
    NH3: 'Sản xuất phân đạm và làm lạnh công nghiệp.',
    CACO3: 'Sản xuất xi măng, vôi, phấn và thực phẩm bổ sung.',
    AL: 'Hàng không, bao bì, dây điện và xây dựng.',
    FE: 'Xây dựng, máy móc và cấu tạo hemoglobin trong máu.',
    CU: 'Dây dẫn điện, vi mạch, trang trí và đúc tượng.',
    ZN: 'Mạ chống gỉ, sản xuất pin và hợp kim đồng thau.',
  };
  const normalizedFormula = normalize(formula);
  if (applications[normalizedFormula]) return applications[normalizedFormula];
  if (category?.includes('Axit')) return 'Sản xuất hóa chất, tẩy rửa bề mặt và điều chỉnh pH.';
  if (category?.includes('Bazơ')) return 'Xử lý nước và sản xuất chất tẩy rửa, xà phòng.';
  if (category?.includes('Muối')) return 'Công nghiệp thực phẩm, phân bón và sản xuất hóa chất.';
  if (category?.includes('Kim loại')) return 'Cơ khí chế tạo, điện tử và xây dựng.';
  return 'Nghiên cứu khoa học, giáo dục và mô phỏng thí nghiệm.';
};

const TIER_THEME = {
  0: { color: '#2563eb', tint: '#eff6ff', icon: Diamond, label: 'Nguyên bản', caption: 'Nguyên liệu ban đầu' },
  1: { color: '#059669', tint: '#ecfdf5', icon: Leaf, label: 'Sơ cấp', caption: 'Điều chế cơ bản' },
  2: { color: '#d97706', tint: '#fffbeb', icon: Zap, label: 'Trung cấp', caption: 'Chuỗi phản ứng' },
  3: { color: '#e11d48', tint: '#fff1f2', icon: Flame, label: 'Cao cấp', caption: 'Thử thách nâng cao' },
  4: { color: '#7c3aed', tint: '#f5f3ff', icon: Sparkles, label: 'Khác', caption: 'Chưa phân bậc' },
};

const DiscoveryMap = ({ chemicals = [], reactions = [], discoveredFormulas = [] }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTier, setActiveTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('all');

  const normalizedDiscovered = useMemo(
    () => new Set(discoveredFormulas.map((formula) => normalize(formula))),
    [discoveredFormulas],
  );

  const itemsByTier = useMemo(() => {
    const tierMap = new Map();
    const grouped = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    chemicals.forEach((chemical) => {
      if (chemical.is_starter || chemical.isStarter) tierMap.set(normalize(chemical.formula), 0);
    });

    let changed = true;
    let iterations = 0;
    while (changed && iterations < 10) {
      changed = false;
      iterations += 1;

      reactions.forEach((reaction) => {
        if (!Array.isArray(reaction.reactants) || !Array.isArray(reaction.products)) return;
        const reactantTiers = reaction.reactants.map((reactant) => tierMap.get(normalize(reactant.formula)));
        if (reactantTiers.some((tier) => tier === undefined)) return;

        const productTier = Math.min(Math.max(...reactantTiers) + 1, 3);
        reaction.products.forEach((product) => {
          const productFormula = normalize(product.formula);
          const currentTier = tierMap.get(productFormula);
          if (currentTier === undefined || productTier < currentTier) {
            tierMap.set(productFormula, productTier);
            changed = true;
          }
        });
      });
    }

    chemicals.forEach((chemical) => {
      const normalizedFormula = normalize(chemical.formula);
      const tier = tierMap.get(normalizedFormula) ?? 4;
      grouped[tier].push({
        ...chemical,
        normalizedFormula,
        tier,
        isDiscovered: normalizedDiscovered.has(normalizedFormula) || chemical.is_starter || chemical.isStarter,
      });
    });

    Object.values(grouped).forEach((items) => {
      items.sort((first, second) => {
        if (first.isDiscovered !== second.isDiscovered) return first.isDiscovered ? -1 : 1;
        return first.normalizedFormula.localeCompare(second.normalizedFormula);
      });
    });

    return grouped;
  }, [chemicals, normalizedDiscovered, reactions]);

  const visibleItems = useMemo(() => {
    const query = normalize(searchQuery);
    return Object.values(itemsByTier).flat().filter((item) => {
      const matchesTier = activeTier === 'all' || item.tier === Number(activeTier);
      const matchesCollection = collectionFilter === 'all'
        || (collectionFilter === 'discovered' ? item.isDiscovered : !item.isDiscovered);
      const searchableText = `${normalize(item.formula)} ${normalize(item.name)} ${normalize(item.category)}`;
      return matchesTier && matchesCollection && (!query || searchableText.includes(query));
    });
  }, [activeTier, collectionFilter, itemsByTier, searchQuery]);

  const selectedData = useMemo(() => {
    if (!selectedId) return null;
    const chemical = chemicals.find((item) => normalize(item.formula) === selectedId);
    const isDiscovered = normalizedDiscovered.has(selectedId) || chemical?.is_starter || chemical?.isStarter;
    const molecule = molecules.find((item) => normalize(item.formula) === selectedId);
    if (molecule) return { ...chemical, ...molecule, isDiscovered, formula: molecule.formula };
    const element = elements.find((item) => normalize(item.symbol) === selectedId);
    if (element) return { ...chemical, ...element, isDiscovered, name: element.name, description: element.desc, formula: element.symbol };
    const craftable = craftableItems.find((item) => normalize(item.formula) === selectedId);
    if (craftable) return { ...chemical, ...craftable, isDiscovered, formula: craftable.formula };
    return { ...chemical, isDiscovered, formula: chemical?.formula || selectedId };
  }, [chemicals, normalizedDiscovered, selectedId]);

  const synthesisPathways = useMemo(() => {
    if (!selectedId) return [];
    return reactions.filter((reaction) => (
      Array.isArray(reaction.products)
      && reaction.products.some((product) => normalize(product.formula) === selectedId)
    ));
  }, [reactions, selectedId]);

  const totalDiscovered = Object.values(itemsByTier).flat().filter((item) => item.isDiscovered).length;

  const renderPathwayNode = (formula, coefficient, name, isProduct = false) => {
    const isDiscovered = normalizedDiscovered.has(normalize(formula));
    const imageSource = getChemicalImage(formula);

    return (
      <div className="flex w-16 flex-col items-center gap-1.5 text-center">
        <div className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border ${isProduct ? 'border-emerald-300 bg-emerald-50' : isDiscovered ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-100'}`}>
          {isDiscovered && imageSource ? (
            <img src={imageSource} alt={name || formula} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className={`text-xs font-black ${isProduct ? 'text-emerald-700' : 'text-slate-700'}`}>
              {isDiscovered || isProduct ? formula : <Lock size={15} />}
            </span>
          )}
          {coefficient > 1 && (
            <span className="absolute right-0 top-0 rounded-bl-md bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-black text-white">{coefficient}</span>
          )}
        </div>
        <span className="line-clamp-2 text-[11px] font-bold leading-tight text-slate-500">{name || formula}</span>
      </div>
    );
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden text-slate-900 lg:flex-row">
      <aside className="shrink-0 border-b border-slate-200 bg-white lg:w-[230px] lg:border-b-0 lg:border-r">
        <div className="discovery-scrollbar flex gap-2 overflow-x-auto p-3 lg:h-full lg:flex-col lg:overflow-y-auto lg:p-5">
          <p className="hidden px-2 pb-1 text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:block">Lọc theo bậc</p>
          <button
            type="button"
            onClick={() => setActiveTier('all')}
            className={`flex min-w-max items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm font-extrabold transition lg:w-full ${activeTier === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <span>Tất cả vật chất</span>
            <span className={`text-xs ${activeTier === 'all' ? 'text-white/70' : 'text-slate-400'}`}>{chemicals.length}</span>
          </button>

          {Object.entries(TIER_THEME).map(([tier, theme]) => {
            const TierIcon = theme.icon;
            const isActive = activeTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`flex min-w-max items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition lg:w-full ${isActive ? 'border-transparent shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                style={isActive ? { backgroundColor: theme.tint, color: theme.color } : undefined}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ color: theme.color, backgroundColor: theme.tint }}>
                  <TierIcon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black">Bậc {tier} · {theme.label}</span>
                  <span className="hidden text-[11px] font-bold opacity-65 lg:block">{theme.caption}</span>
                </span>
                <span className="text-xs font-black opacity-60">{itemsByTier[tier].length}</span>
              </button>
            );
          })}

          <div className="mt-auto hidden rounded-2xl bg-emerald-50 p-4 lg:block">
            <div className="mb-2 flex items-center gap-2 text-emerald-700">
              <Check size={16} />
              <span className="text-xs font-black uppercase tracking-wider">Đã thu thập</span>
            </div>
            <p className="text-2xl font-black text-slate-950">{totalDiscovered}</p>
            <p className="text-xs font-bold text-slate-500">trên tổng số {chemicals.length} vật chất</p>
          </div>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f6f8fb]">
        <div className="shrink-0 border-b border-slate-200 bg-white/90 p-3 backdrop-blur sm:p-4 lg:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1 sm:max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm theo tên, công thức hoặc nhóm chất..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-[16px] font-semibold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'discovered', label: 'Đã mở' },
                { id: 'locked', label: 'Chưa mở' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setCollectionFilter(filter.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-black transition sm:flex-none ${collectionFilter === filter.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="discovery-scrollbar min-h-0 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {activeTier === 'all' ? 'Bộ sưu tập vật chất' : `Bậc ${activeTier} · ${TIER_THEME[activeTier].label}`}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-slate-500">Hiển thị {visibleItems.length} kết quả</p>
            </div>
            <p className="hidden text-xs font-bold text-slate-400 sm:block">Chọn một thẻ để xem chi tiết</p>
          </div>

          {visibleItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleItems.map((item) => {
                const theme = TIER_THEME[item.tier];
                const imageSource = getChemicalImage(item.formula);
                return (
                  <motion.button
                    layout
                    key={item.normalizedFormula}
                    type="button"
                    onClick={() => setSelectedId(item.normalizedFormula)}
                    className={`group relative min-h-[112px] overflow-hidden rounded-2xl border bg-white p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-100 ${item.isDiscovered ? 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg' : 'border-dashed border-slate-300 hover:border-slate-400'}`}
                  >
                    <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: theme.color }} />
                    <div className="flex items-center gap-3.5">
                      <div
                        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border text-base font-black"
                        style={{ borderColor: `${theme.color}30`, backgroundColor: theme.tint, color: theme.color }}
                      >
                        {item.isDiscovered && imageSource ? (
                          <img src={imageSource} alt={item.name || item.formula} className="absolute inset-0 h-full w-full object-cover" />
                        ) : item.isDiscovered ? item.formula : <Lock size={20} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className={`truncate text-base font-black ${item.isDiscovered ? 'text-slate-950' : 'text-slate-600'}`}>
                            {item.isDiscovered ? item.name : 'Vật chất bí ẩn'}
                          </p>
                          <span className="shrink-0 rounded-md px-1.5 py-1 text-[11px] font-black" style={{ backgroundColor: theme.tint, color: theme.color }}>B{item.tier}</span>
                        </div>
                        <p className="truncate text-sm font-extrabold" style={{ color: item.isDiscovered ? theme.color : '#94a3b8' }}>
                          {item.isDiscovered ? item.formula : 'Chưa khám phá'}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                          {item.isDiscovered ? item.category || 'Vật chất' : 'Thử phản ứng mới trong Lab'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
              <Search className="mb-4 text-slate-300" size={34} />
              <h3 className="text-lg font-black text-slate-900">Không tìm thấy vật chất phù hợp</h3>
              <p className="mt-1 max-w-sm text-sm font-semibold text-slate-500">Thử từ khóa khác hoặc chọn lại bộ lọc.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveTier('all'); setCollectionFilter('all'); }}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedId && selectedData && (
          <>
            <motion.button
              type="button"
              aria-label="Đóng chi tiết vật chất"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 z-20 bg-slate-950/25 backdrop-blur-[2px]"
            />
            <motion.aside
              role="region"
              aria-labelledby="chemical-detail-title"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute inset-y-0 right-0 z-30 flex w-full flex-col border-l border-slate-200 bg-white shadow-[-20px_0_60px_rgba(15,23,42,0.16)] sm:w-[min(500px,calc(100%-2rem))]"
            >
              <div className="shrink-0 border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${selectedData.isDiscovered ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {selectedData.isDiscovered ? selectedData.formula || selectedData.symbol : <Lock size={23} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Hồ sơ vật chất</p>
                      <h3 id="chemical-detail-title" className="mt-1 truncate text-2xl font-black text-slate-950">
                        {selectedData.isDiscovered ? selectedData.name : 'Vật chất bí ẩn'}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-slate-500">
                        {selectedData.isDiscovered ? selectedData.category || 'Vật chất' : 'Chưa khám phá'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Đóng chi tiết vật chất"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              <div className="discovery-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                <section>
                  <div className="mb-3 flex items-center gap-2 text-slate-600">
                    <Activity size={17} />
                    <h4 className="text-sm font-black">Cách điều chế</h4>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {!selectedData.isDiscovered ? (
                      <p className="py-4 text-center text-sm font-semibold leading-relaxed text-slate-500">Công thức sẽ xuất hiện sau khi bạn khám phá vật chất này trong phòng Lab.</p>
                    ) : selectedData.is_starter || selectedData.isStarter ? (
                      <p className="py-3 text-center text-sm font-semibold text-slate-500">Đây là nguyên liệu gốc, có sẵn khi bắt đầu thí nghiệm.</p>
                    ) : synthesisPathways.length > 0 ? synthesisPathways.map((pathway, pathwayIndex) => (
                      <div key={pathway.id || pathwayIndex} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-xs font-black text-slate-600">Cách {pathwayIndex + 1}</span>
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">{pathway.type || 'Phản ứng'}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <div className="flex items-center gap-1">
                            {pathway.reactants.map((reactant, index) => (
                              <React.Fragment key={`${reactant.formula}-${index}`}>
                                {index > 0 && <Plus size={14} className="text-slate-400" />}
                                {renderPathwayNode(reactant.formula, reactant.coeff, reactant.name)}
                              </React.Fragment>
                            ))}
                          </div>
                          <ArrowRight size={20} className="text-emerald-600" />
                          <div className="flex items-center gap-1">
                            {pathway.products.map((product, index) => (
                              <React.Fragment key={`${product.formula}-${index}`}>
                                {index > 0 && <Plus size={14} className="text-slate-400" />}
                                {renderPathwayNode(product.formula, product.coeff, product.name, normalize(product.formula) === selectedId)}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        {pathway.conditions && <p className="mt-3 text-center text-xs font-semibold text-slate-500">Điều kiện: {pathway.conditions}</p>}
                      </div>
                    )) : (
                      <p className="py-3 text-center text-sm font-semibold text-slate-500">Chưa có công thức tạo chất này trong dữ liệu.</p>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-600">
                    <Microscope size={17} />
                    <h4 className="text-sm font-black">Tính chất và mô tả</h4>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-slate-600">
                    {selectedData.isDiscovered
                      ? selectedData.description || 'Chưa có mô tả chi tiết cho vật chất này.'
                      : 'Hãy thử kết hợp các chất trong phòng Lab để mở khóa thông tin.'}
                  </p>
                </section>

                {selectedData.isDiscovered && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <section className="rounded-2xl bg-slate-900 p-4 text-white">
                      <p className="text-xs font-bold text-slate-400">Khối lượng phân tử</p>
                      <p className="mt-2 text-2xl font-black">
                        {selectedData.molarMass || selectedData.weight || calculateMolarMass(selectedData.formula || selectedData.symbol)?.toFixed(3) || '—'}
                        <span className="ml-1 text-sm text-slate-400">u</span>
                      </p>
                    </section>
                    <section className="rounded-2xl bg-emerald-50 p-4 sm:col-span-1">
                      <p className="text-xs font-black text-emerald-700">Ứng dụng thực tế</p>
                      <p className="mt-2 text-sm font-semibold leading-5 text-slate-700">{getApplications(selectedData.formula || selectedData.symbol, selectedData.category)}</p>
                    </section>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoveryMap;
