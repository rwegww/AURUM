import { reactions } from '../../data/reactions';
import { elements } from '../../data/elements';

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
    const q = query.toLowerCase().trim();

    // 1. Parse Intent and Extract Chemicals
    const foundTokens = this.extractChemicals(q);
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
      message: `Tôi là Aurum AI. Tôi hiểu về ${this.elements.length} nguyên tố và hàng trăm chất hóa học. Hãy thử hỏi về "${randomElements[0].name}" hoặc phản ứng giữa các chất!`,
      suggestions: [`${randomElements[0].symbol} là gì?`, "Na + H2O", "KMnO4"]
    };
  }

  extractChemicals(query) {
    const tokens = [];
    const normalizedQuery = normalizeFormula(query).toLowerCase();

    // Strategy 1: Look for exact formulas (e.g., KMnO4, H2O)
    // We sort keys by length descending to match longest possible string first (e.g. NaOH over Na)
    const sortedKeys = Array.from(this.chemicalDict.keys()).sort((a, b) => b.length - a.length);

    let tempQuery = " " + normalizedQuery + " ";
    for (const key of sortedKeys) {
      const pattern = new RegExp(`(^|[^A-Z0-9])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Z0-9]|$)`, 'i');
      if (pattern.test(tempQuery)) {
        tokens.push(this.chemicalDict.get(key));
        // Remove the match to prevent redundant partial matches (but be careful with Na in NaOH)
        // For now, just adding and ensuring longest match first handles most cases.
        if (tokens.length >= 3) break; 
      }
    }

    // Deduplicate tokens by formula
    const unique = [];
    const seen = new Set();
    tokens.forEach(t => {
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

    // ML Simulation for binary reactions
    if (tokens.length === 2) {
      const t1 = tokens[0];
      const t2 = tokens[1];
      
      if (t1.name.includes("Kiềm") || t2.name.includes("Kiềm") || t1.formula === 'Na' || t1.formula === 'K') {
        if (t1.formula === 'H2O' || t2.formula === 'H2O') {
          return {
            message: `🤖 [AI Predictor]: Tôi dự đoán **${t1.name} (${t1.formula})** sẽ phản ứng mạnh với **${t2.name} (${t2.formula})** giải phóng nhiệt và khí Hydro (H₂).`,
            confidence: 0.95
          };
        }
      }
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
