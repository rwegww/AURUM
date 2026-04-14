import { reactions } from '../../data/reactions';
import { elements } from '../../data/elements';
import ReactionML from './ReactionML';

/**
 * Clean and normalize formula for comparison
 */
const normalizeFormula = (f) => {
  if (!f) return "";
  const map = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => map[m]).toUpperCase().trim();
};

const formatSubscripts = (f) => {
  if (!f) return "";
  const map = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  return f.toString().replace(/\d/g, (m) => map[m]);
};

const SAFETY_RESTRICTIONS = [
  "thuốc nổ", "bom", "chế tạo nổ", "bang", "TNT", "Dynamite", "nguy hiểm", "độc hại", "giết", "tấn công"
];

const PEDAGOGICAL_PROMPTS = [
  "Bạn có muốn thử mô phỏng phản ứng này trong Lab 3D không?",
  "Bạn có biết yếu tố nào ảnh hưởng đến tốc độ của phản ứng này không?",
  "Hãy thử tìm hiểu thêm về ứng dụng thực tế của chất này trong đời sống nhé!",
  "Bạn có muốn tôi giải thích rõ hơn về cơ chế lớp vỏ electron của phản ứng này không?"
];

const THEORY_DATABASE = [
  {
    id: 'mol-mass',
    patterns: ['mol theo khối lượng', 'n = m/m', 'mol từ m'],
    title: 'Công thức tính số mol (n) theo khối lượng (m)',
    formula: 'n = \\frac{m}{M}',
    explanation: 'Trong đó:\n- **n**: Số mol (mol)\n- **m**: Khối lượng chất (g)\n- **M**: Khối lượng mol (g/mol)',
    suggestions: ['Tính mol theo thể tích', 'Khối lượng mol là gì?']
  },
  {
    id: 'mol-vol',
    patterns: ['mol theo thể tích', 'đktc', 'v/22.4', 'mol khí'],
    title: 'Công thức tính số mol (n) chất khí (đktc)',
    formula: 'n = \\frac{V}{22,4}',
    explanation: 'Trong đó:\n- **n**: Số mol (mol)\n- **V**: Thể tích khí ở đktc (lít)',
    suggestions: ['Tính mol theo khối lượng', '22.4 là gì?']
  },
  {
    id: 'molar-conc',
    patterns: ['nồng độ mol', 'cm', 'v dung dịch', 'mol/l'],
    title: 'Công thức tính nồng độ Mol (C_M)',
    formula: 'C_M = \\frac{n}{V}',
    explanation: 'Trong đó:\n- **C_M**: Nồng độ mol (mol/l hoặc M)\n- **n**: Số mol chất tan (mol)\n- **V**: Thể tích dung dịch (lít)',
    suggestions: ['Nồng độ phần trăm', 'Cách pha loãng dung dịch']
  },
  {
    id: 'percent-conc',
    patterns: ['nồng độ phần trăm', 'c%', 'm dung dịch'],
    title: 'Công thức tính nồng độ phần trăm (C%)',
    formula: 'C\\% = \\frac{m_{ct}}{m_{dd}} \\times 100\\%',
    explanation: 'Trong đó:\n- **C%**: Nồng độ phần trăm (%)\n- **m_ct**: Khối lượng chất tan (g)\n- **m_dd**: Khối lượng dung dịch (g)',
    suggestions: ['Cách tính m dung dịch', 'Nồng độ mol']
  },
  {
    id: 'bonding',
    patterns: ['liên kết gì', 'liên kết hóa học', 'loại liên kết'],
    title: 'Các loại liên kết hóa học cơ bản',
    formula: '\\text{Cộng hóa trị} \\longleftrightarrow \\text{Ion} \\longleftrightarrow \\text{Kim loại}',
    explanation: 'Cấu trúc liên kết phụ thuộc vào độ âm điện:\n- **Cộng hóa trị**: Chia sẻ electron (phi kim - phi kim).\n- **Ion**: Cho/nhận electron (kim loại - phi kim).\n- **Kim loại**: Biển electron dùng chung.',
    suggestions: ['Liên kết của Nito', 'Độ âm điện là gì?']
  }
];

// Map of common valencies for quick lookup
const VALENCY_MAP = {
  'H': 'I', 'He': '0', 'Li': 'I', 'Be': 'II', 'B': 'III', 'C': 'II, IV', 'N': 'II, III, IV, V', 'O': 'II', 'F': 'I',
  'Na': 'I', 'Mg': 'II', 'Al': 'III', 'Si': 'IV', 'P': 'III, V', 'S': 'II, IV, VI', 'Cl': 'I', 'Ar': '0',
  'K': 'I', 'Ca': 'II', 'Fe': 'II, III', 'Cu': 'I, II', 'Zn': 'II', 'Ag': 'I', 'Ba': 'II'
};

/**
 * AURUM EXPERT ENGINE
 * An advanced data-driven assistant for chemistry.
 */
class AurumExpertEngine {
  constructor() {
    this.reactions = reactions;
    this.elements = elements;
    this.theoryDb = THEORY_DATABASE;
    this.valencyMap = VALENCY_MAP;
    this.chemicalDict = new Map();
    this.init();
    ReactionML.init(); // Initialize Neural Network
  }

  /**
   * Index all data for fast retrieval
   */
  async init() {
    // Index Elements
    this.elements.forEach(el => {
      const normSym = normalizeFormula(el.symbol);
      const name = el.name.toLowerCase();
      this.chemicalDict.set(normSym, { type: 'element', data: el, name: el.name, formula: el.symbol });
      this.chemicalDict.set(name, { type: 'element', data: el, name: el.name, formula: el.symbol });
    });

    // Index Chemicals from Reactions
    this.reactions.forEach(rx => {
      const allChems = [...rx.reactants, ...rx.products];
      allChems.forEach(c => {
        const normF = normalizeFormula(c.formula);
        const name = c.name?.toLowerCase();
        if (!this.chemicalDict.has(normF)) {
          this.chemicalDict.set(normF, { type: 'chemical', formula: c.formula, name: c.name });
        }
        if (name && !this.chemicalDict.has(name)) {
          this.chemicalDict.set(name, { type: 'chemical', formula: c.formula, name: c.name });
        }
      });
    });
  }

  /**
   * Main entry point for user queries
   */
  async ask(query, context = {}) {
    const { role = 'student', user = {} } = context;
    let q = query.toLowerCase().trim();

    // 0. Safety Guardrails (Aurum Constitution)
    if (SAFETY_RESTRICTIONS.some(word => q.includes(word))) {
      return {
        message: "🛡️ **[Thông báo An toàn Aurum]**\n\nTôi là một trợ lý giáo dục và không được phép cung cấp hướng dẫn liên quan đến các chất nguy hiểm, cháy nổ hoặc độc hại ngoài chương trình học.\n\nThay vào đó, bạn có muốn tìm hiểu về các **phản ứng an toàn** trong phòng thí nghiệm ảo của chúng tôi không?",
        safety: 'Danger',
        suggestions: ["Axit hữu cơ là gì?", "Phản ứng trung hòa", "Kim loại kiềm"]
      };
    }

    // 1. Handle Valency Queries (Hóa trị)
    if (q.includes("hóa trị")) {
        const tokens = this.extractChemicals(query);
        if (tokens.length > 0) return this.handleValencyRequest(tokens[0]);
    }
    
    // 2. Handle Theory/Formula Queries
    const theoryMatch = this.theoryDb.find(t => t.patterns.some(p => q.includes(p)));
    if (theoryMatch) {
      return this.handleTheoryRequest(theoryMatch);
    }
    
    // 2. Parse Intent and Extract Chemicals
    const foundTokens = this.extractChemicals(query); 
    const isReactionQuery = q.includes("+") || q.includes("tác dụng") || q.includes("phản ứng");

    // 3. Handle Reaction Queries
    if (isReactionQuery && foundTokens.length >= 2) {
      return this.handleReactionRequest(foundTokens);
    }

    // 4. Handle Info Queries (Single chemical/element)
    if (foundTokens.length === 1) {
      return this.handleInfoRequest(foundTokens[0]);
    }

    // 5. Role-based/Platform triggers
    if (q.includes("vai trò")) return this.handleRoleCheck(role);
    if (q.includes("bài học")) return this.handleLessonHelp(role);

    // 6. Default Fallback
    const randomElements = this.elements.sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      message: `Tôi là Aurum AI. Tôi được trang bị **Mạng thần kinh nhân tạo (Neural Network)** để dự đoán các phản ứng hóa học phức tạp. Bạn muốn thử nghiệm chất nào?`,
      suggestions: [`${randomElements[0].symbol} là gì?`, "Phản ứng Na + Cl2", "Dự đoán Ba + O2"]
    };
  }

  handleTheoryRequest(theory) {
    return {
      message: `📚 **${theory.title}**\n\n$$\n${theory.formula}\n$$\n\n${theory.explanation}`,
      suggestions: theory.suggestions
    };
  }

  handleValencyRequest(token) {
    const symbol = token.formula || token.data?.symbol;
    const valency = this.valencyMap[symbol];
    
    if (valency) {
      return {
        message: `🌟 **Hóa trị của ${token.name} (${symbol})**\n\nTrong các hợp chất phổ biến, **${token.name}** có hóa trị là: **${valency}**.\n\n📖 **Gợi ý:** Bạn có muốn tìm hiểu về các phản ứng của ${token.name} không?`,
        suggestions: [`Phản ứng có ${symbol}`, `Đặc điểm của ${token.name}`]
      };
    }

    return {
      message: `Tôi nhận thấy bạn đang hỏi về hóa trị của **${token.name}**, nhưng thông tin này hiện chưa có trong cơ sở dữ liệu chuyên sâu của tôi.`,
      suggestions: [`${symbol} là gì?`, "Bảng hóa trị cơ bản"]
    };
  }

  extractChemicals(originalQuery) {
    const tokens = [];
    const lowerQuery = originalQuery.toLowerCase();
    const normalizedQuery = normalizeFormula(lowerQuery).toLowerCase();
    const sortedKeys = Array.from(this.chemicalDict.keys()).sort((a, b) => b.length - a.length);

    let availableQuery = normalizedQuery;
    const matches = [];

    for (const key of sortedKeys) {
      const normKey = normalizeFormula(key).toLowerCase();
      const isShort = normKey.length <= 2;
      const pattern = isShort 
        ? new RegExp(`(?:^|[^\\p{L}\\p{N}])${normKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[^\\p{L}\\p{N}]|$)`, 'iu')
        : new RegExp(normKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu');

      let match;
      while ((match = pattern.exec(availableQuery)) !== null) {
        let startIndex = match.index;
        if (isShort && match[0].length > normKey.length) {
            const offset = match[0].toLowerCase().indexOf(normKey);
            startIndex += offset;
        }
        const actualKey = normKey;
        matches.push({
          token: this.chemicalDict.get(key),
          start: startIndex,
          end: startIndex + actualKey.length
        });
        const blackout = " ".repeat(actualKey.length);
        availableQuery = availableQuery.substring(0, startIndex) + blackout + availableQuery.substring(startIndex + actualKey.length);
      }
      if (matches.length >= 6) break;
    }

    const sortedTokens = matches
      .sort((a, b) => a.start - b.start)
      .map(m => m.token);

    const unique = [];
    const seen = new Set();
    sortedTokens.forEach(t => {
      const normF = normalizeFormula(t.formula);
      if (!seen.has(normF)) {
        unique.push(t);
        seen.add(normF);
      }
    });

    return unique;
  }

  handleReactionRequest(tokens) {
    const formulas = tokens.map(t => normalizeFormula(t.formula));
    const randomPrompt = PEDAGOGICAL_PROMPTS[Math.floor(Math.random() * PEDAGOGICAL_PROMPTS.length)];
    
    // Search DB for exact match
    const match = this.reactions.find(rx => {
      const rxReactants = rx.reactants.map(r => normalizeFormula(r.formula));
      return rxReactants.length === formulas.length && formulas.every(f => rxReactants.includes(f));
    });

    if (match) {
      return {
        message: `🤖 Tôi đã tìm thấy phản ứng: **${match.name}**\n\n📌 **Phương trình:** ${match.equation}\n\n🔍 **Hiện tượng:** ${match.observation}\n\n⚠️ **Cảnh báo:** ${match.safetyWarning}\n\n🎓 **Gợi ý học tập:** ${randomPrompt}`,
        data: match,
        safety: match.safetyWarning.toLowerCase().includes('nguy hiểm') ? 'Caution' : 'Safe',
        type: 'reaction'
      };
    }

    // NEURAL NETWORK PREDICTION
    if (tokens.length === 2) {
      const prediction = ReactionML.predict(tokens[0], tokens[1]);
      return {
        message: `🤖 **[Neural AI Prediction]**\n\nTôi dự đoán phản ứng này có xác suất xảy ra cao dựa trên mô hình học máy của tôi.\n\n- **Loại phản ứng:** ${prediction.type}\n- **Độ tin cậy:** ${(prediction.confidence * 100).toFixed(1)}%\n- **Mức độ an toàn:** ${prediction.safety}\n\n📖 **Giải cấu trúc:** ${prediction.explanation}\n\n🎓 **Gợi ý:** ${randomPrompt}`,
        confidence: prediction.confidence,
        safety: prediction.safety
      };
    }

    return {
      message: `Tôi chưa tìm thấy phản ứng chính xác trong thư viện thực hành. Tuy nhiên, ${randomPrompt}`,
      suggestions: [`${tokens[0].formula} là gì?`, `${tokens[1].formula} là gì?`]
    };
  }

  handleInfoRequest(token) {
    const randomPrompt = PEDAGOGICAL_PROMPTS[Math.floor(Math.random() * PEDAGOGICAL_PROMPTS.length)];
    if (token.type === 'element') {
      const el = token.data;
      return {
        message: `🌟 **${el.name} (${el.symbol})**\n\n- **Số hiệu:** ${el.atomic_number || el.number}\n- **Khối lượng:** ${el.atomic_mass || el.weight}\n- **Phân loại:** ${el.category}\n\n📖 **Mô tả:** ${el.desc}\n\n🎓 **Hỏi Aurum:** ${randomPrompt}`,
        actions: [{ label: "Xem Chi Tiết Nguyên Tử", link: "/periodic-table" }]
      };
    }

    return {
      message: `🧪 **${token.name} (${formatSubscripts(token.formula)})**\n\nĐây là một chất hóa học quan trọng. ${randomPrompt}`,
      suggestions: [`Phản ứng có ${token.formula}`, `${token.name} tác dụng với gì?`]
    };
  }

  handleRoleCheck(role) {
    const roles = {
      student: "Chào bạn. Với vai trò Học sinh, tôi tuân thủ các chính sách an toàn giáo dục để hỗ trợ bạn học tập lành mạnh.",
      teacher: "Chào đồng nghiệp. Ở vai trò Giáo viên, tôi có thể cung cấp thêm các dữ liệu về cảnh báo an toàn cho bài giảng của bạn.",
      admin: "Truy cập Admin. Hệ thống AI đang vận hành dưới sự giám sát chặt chẽ của các quy chuẩn đạo đức."
    };
    return { message: roles[role] || "Tôi sẵn sàng hỗ trợ bạn!" };
  }
  handleLessonHelp(role) {
    return { 
      message: "Lộ trình học tập của bạn đang ở chương 'Phản ứng Hóa học'. Bạn có muốn tôi liệt kê các bài học quan trọng không?",
      actions: [{ label: "Mở Danh Sách Bài Học", link: "/lessons" }]
    };
  }
}

export const AurumExpert = new AurumExpertEngine();
export default AurumExpert;
