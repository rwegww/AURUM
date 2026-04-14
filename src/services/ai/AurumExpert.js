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

const VI_STOP_WORDS = ["có", "của", "và", "là", "trong", "phản", "ứng", "với", "hỏi", "đáp", "gì", "cho", "biết", "tại", "sao", "thế", "nào", "mấy", "bao", "nhiêu"];

/**
 * AURUM EXPERT ENGINE
 * An advanced data-driven assistant for chemistry.
 */
class AurumExpertEngine {
  constructor() {
    this.reactions = reactions;
    this.elements = elements;
    this.chemicalDict = new Map();
    this.init();
    ReactionML.init(); // Initialize Neural Network
  }

  /**
   * Index all data for fast retrieval
   */
  init() {
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
    
    // Clean query from stop words before processing
    let q = query.toLowerCase().trim();
    
    // 1. Parse Intent and Extract Chemicals
    const foundTokens = this.extractChemicals(query); // Pass original case for better detection
    const isReactionQuery = q.includes("+") || q.includes("tác dụng") || q.includes("phản ứng");

    // 2. Handle Reaction Queries
    if (isReactionQuery && foundTokens.length >= 2) {
      return this.handleReactionRequest(foundTokens);
    }

    // 3. Handle Info Queries (Single chemical/element)
    if (foundTokens.length === 1) {
      return this.handleInfoRequest(foundTokens[0]);
    }

    // 4. Role-based/Platform triggers
    if (q.includes("vai trò")) return this.handleRoleCheck(role);
    if (q.includes("bài học")) return this.handleLessonHelp(role);

    // 5. Default Fallback with suggestions from DB
    const randomElements = this.elements.sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      message: `Tôi là Aurum AI. Tôi được trang bị **Mạng thần kinh nhân tạo (Neural Network)** để dự đoán các phản ứng hóa học phức tạp. Bạn muốn thử nghiệm chất nào?`,
      suggestions: [`${randomElements[0].symbol} là gì?`, "Phản ứng Na + Cl2", "Dự đoán Ba + O2"]
    };
  }

  extractChemicals(originalQuery) {
    const tokens = [];
    const lowerQuery = originalQuery.toLowerCase();
    
    // 1. Normalize the entire query string to handle subscripts -> numbers
    // This ensures H₂O in the query is seen as H2O
    const normalizedQuery = normalizeFormula(lowerQuery).toLowerCase();
    
    // 2. Scan the dictionary using Greedy Matching (longest first)
    const sortedKeys = Array.from(this.chemicalDict.keys()).sort((a, b) => b.length - a.length);

    // We'll keep track of which parts of the string are "consumed"
    let availableQuery = normalizedQuery;
    const matches = [];

    for (const key of sortedKeys) {
      const normKey = normalizeFormula(key).toLowerCase();
      
      // Strict matching boundary for single letters or short symbols
      const isShort = normKey.length <= 2;
      const pattern = isShort 
        ? new RegExp(`(^|[^a-z0-9])${normKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i')
        : new RegExp(normKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      let match;
      while ((match = pattern.exec(availableQuery)) !== null) {
        const matchStr = isShort ? match[0].trim() : match[0];
        const startIndex = match.index + (isShort && match[0].startsWith(' ') ? 1 : 0);
        const actualKey = normKey;
        
        matches.push({
          token: this.chemicalDict.get(key),
          start: startIndex,
          end: startIndex + actualKey.length
        });

        // "Black out" the consumed part of the string with spaces to prevent shorter matches
        const blackout = " ".repeat(actualKey.length);
        availableQuery = availableQuery.substring(0, startIndex) + blackout + availableQuery.substring(startIndex + actualKey.length);
      }

      if (matches.length >= 5) break;
    }

    // Sort matches by their original position and deduplicate
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
    
    // Search DB for exact match
    const match = this.reactions.find(rx => {
      const rxReactants = rx.reactants.map(r => normalizeFormula(r.formula));
      return rxReactants.length === formulas.length && formulas.every(f => rxReactants.includes(f));
    });

    if (match) {
      return {
        message: `🤖 Tôi đã tìm thấy phản ứng: **${match.name}**\n\n📌 **Phương trình:** ${match.equation}\n\n🔍 **Hiện tượng:** ${match.observation}\n\n⚠️ **Cảnh báo:** ${match.safetyWarning}`,
        data: match,
        type: 'reaction'
      };
    }

    // NEURAL NETWORK PREDICTION (Instead of simple simulation)
    if (tokens.length === 2) {
      const prediction = ReactionML.predict(tokens[0], tokens[1]);
      return {
        message: `🤖 **[Neural AI Prediction]**\n\nTôi dự đoán phản ứng này có xác suất xảy ra cao dựa trên mô hình học máy của tôi.\n\n- **Loại phản ứng:** ${prediction.type}\n- **Độ tin cậy:** ${(prediction.confidence * 100).toFixed(1)}%\n\n📖 **Giải cấu trúc:** ${prediction.explanation}`,
        confidence: prediction.confidence
      };
    }

    return {
      message: `Tôi chưa tìm thấy phản ứng chính xác giữa ${tokens.map(t => t.name).join(' và ')} trong thư viện thực hành, nhưng bạn có thể thử xem tính chất riêng của từng chất.`,
      suggestions: [`${tokens[0].formula} là gì?`, `${tokens[1].formula} là gì?`]
    };
  }

  handleInfoRequest(token) {
    if (token.type === 'element') {
      const el = token.data;
      return {
        message: `🌟 **${el.name} (${el.symbol})**\n\n- **Số hiệu:** ${el.atomic_number || el.number}\n- **Khối lượng:** ${el.atomic_mass || el.weight}\n- **Phân loại:** ${el.category}\n\n📖 **Mô tả:** ${el.desc}`,
        actions: [{ label: "Xem Chi Tiết Nguyên Tử", link: "/periodic-table" }]
      };
    }

    // Chemical from reactions
    return {
      message: `🧪 **${token.name} (${formatSubscripts(token.formula)})**\n\nĐây là một chất hóa học có trong chương trình học của chúng ta. Bạn muốn tìm hiểu về các phản ứng liên quan đến chất này không?`,
      suggestions: [`Phản ứng có ${token.formula}`, `${token.name} tác dụng với gì?`]
    };
  }

  handleRoleCheck(role) {
    const roles = {
      student: "Chào bạn. Với vai trò Học sinh, tôi sẽ giúp bạn tra cứu nhanh công thức và hiện tượng phản ứng để làm bài tập hiệu quả hơn.",
      teacher: "Chào đồng nghiệp. Ở vai trò Giáo viên, tôi có thể hỗ trợ bạn liệt kê các phản ứng mẫu cho bài giảng.",
      admin: "Truy cập Admin. Hệ thống đang hoạt động ổn định với đầy đủ dữ liệu nguyên tố và phản ứng."
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
