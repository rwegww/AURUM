import { chemicals, reactions } from '../src/data/reactions/index.js';
import { isStructurallyBalancedReaction, normalizeLabFormula } from '../src/utils/labChemistry.js';

const REQUIRED_REACTION_FIELDS = [
  'id', 'name', 'type', 'reactants', 'products', 'equation', 'gradeLevel',
  'category', 'conditions', 'observation', 'energy', 'animation', 'dangerLevel',
  'safetyWarning',
];
const SUPPORTED_EFFECTS = new Set([
  'burn', 'color-change', 'combustion', 'explosion', 'fizz', 'mix',
  'precipitation', 'smoke', 'smoke_purple', 'synthesis',
]);

const errors = [];
const warnings = [];
const chemicalByFormula = new Map();
const reactionIds = new Set();

chemicals.forEach((chemical) => {
  const formula = normalizeLabFormula(chemical.formula);
  if (!formula) errors.push('Có hóa chất không có công thức.');
  if (chemicalByFormula.has(formula)) errors.push(`Trùng công thức hóa chất: ${chemical.formula}`);
  chemicalByFormula.set(formula, chemical);

  if (!chemical.name || !chemical.state || !chemical.category || !chemical.color) {
    errors.push(`Hóa chất ${chemical.formula || '(không rõ)'} thiếu tên, trạng thái, danh mục hoặc màu.`);
  }
});

reactions.forEach((reaction) => {
  if (reactionIds.has(reaction.id)) errors.push(`Trùng mã phản ứng: ${reaction.id}`);
  reactionIds.add(reaction.id);

  const missingFields = REQUIRED_REACTION_FIELDS.filter((field) => {
    const value = reaction[field];
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
  });
  if (missingFields.length > 0) errors.push(`${reaction.id} thiếu: ${missingFields.join(', ')}`);

  [...(reaction.reactants || []), ...(reaction.products || [])].forEach((species) => {
    if (!chemicalByFormula.has(normalizeLabFormula(species.formula))) {
      errors.push(`${reaction.id} tham chiếu hóa chất chưa khai báo: ${species.formula}`);
    }
    if (!Number.isFinite(Number(species.coeff)) || Number(species.coeff) <= 0) {
      errors.push(`${reaction.id} có hệ số không hợp lệ ở ${species.formula}`);
    }
  });

  if (!reaction.isQualitative && !isStructurallyBalancedReaction(reaction)) {
    errors.push(`${reaction.id} chưa cân bằng: ${reaction.equation}`);
  }
  if (!SUPPORTED_EFFECTS.has(reaction.animation)) {
    errors.push(`${reaction.id} dùng hiệu ứng chưa hỗ trợ: ${reaction.animation}`);
  }

  const precipitates = (reaction.products || []).filter(product => product.isPrecipitate);
  if (reaction.animation === 'precipitation' && precipitates.length === 0) {
    errors.push(`${reaction.id} có hiệu ứng kết tủa nhưng chưa chỉ rõ sản phẩm kết tủa.`);
  }
  if (precipitates.length > 0 && !reaction.precipitationEquation) {
    errors.push(`${reaction.id} thiếu phương trình tạo kết tủa.`);
  }
  if (precipitates.length > 0 && !reaction.netIonicEquation) {
    warnings.push(`${reaction.id} là phản ứng kết tủa phân tử/hữu cơ, không có phương trình ion rút gọn.`);
  }
});

const precipitationCount = reactions.filter(reaction => reaction.precipitate).length;
const ionicEquationCount = reactions.filter(reaction => reaction.netIonicEquation).length;
const qualitativeCount = reactions.filter(reaction => reaction.isQualitative).length;

console.log(`Đã kiểm tra ${chemicals.length} hóa chất và ${reactions.length} phản ứng.`);
console.log(`Kết tủa: ${precipitationCount}; có phương trình ion: ${ionicEquationCount}; định tính: ${qualitativeCount}.`);

warnings.forEach(warning => console.warn(`Cảnh báo: ${warning}`));
if (errors.length > 0) {
  errors.forEach(error => console.error(`Lỗi: ${error}`));
  process.exitCode = 1;
} else {
  console.log('Dữ liệu Lab hợp lệ.');
}

