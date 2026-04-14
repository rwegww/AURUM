import { reactions } from '../../data/reactions';
import { elements } from '../../data/elements';

/**
 * Clean and normalize formula for comparison
 */
const normalizeFormula = (f) => {
  if (!f) return "";
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => {
    const map = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    return map[m];
  }).toUpperCase().trim();
};

/**
 * AURUM EXPERT ENGINE
 * A deterministic AI-like system for chemistry and platform support.
 */
class AurumExpertEngine {
  constructor() {
    this.reactions = reactions;
    this.elements = elements;
  }

  /**
   * Main entry point for user queries
   */
  async ask(query, context = {}) {
    const { role = 'student', page = 'home', user = {} } = context;
    const q = query.toLowerCase().trim();

    // 1. Role-based trigger bypass
    if (q.includes("vai trò") || q.includes("who am i")) {
      return this.handleRoleCheck(role);
    }

    // 2. Reactant Prediction (Machine Learning Simulation)
    if (q.includes("phản ứng") && (q.includes("+") || q.includes("với"))) {
      return this.handleReactionPrediction(q);
    }

    // 3. Chemical Knowledge Search
    const elementMatch = this.findElement(q);
    if (elementMatch) {
      return this.handleElementInfo(elementMatch);
    }

    const chemicalMatch = this.findChemical(q);
    if (chemicalMatch) {
      return this.handleChemicalInfo(chemicalMatch);
    }

    // 4. Platform Help
    if (q.includes("bài học") || q.includes("học gì")) {
      return this.handleLessonHelp(role);
    }
    
    if (q.includes("arena") || q.includes("đấu trường")) {
      return {
        message: "Chào mừng bạn đến với Đấu trường Aurum! Tại đây bạn có thể so tài kiến thức hóa học với bạn bè. Bạn muốn tôi tìm phòng hay xem bảng xếp hạng?",
        actions: [
          { label: "Tìm trận ngay", link: "/arena" },
          { label: "Xem BXH", link: "/" }
        ]
      };
    }

    // 5. Default Fallback
    return {
      message: `Tôi là Aurum AI. Tôi có thể giải đáp về ${this.elements.length} nguyên tố, ${this.reactions.length} phản ứng hóa học và hỗ trợ lộ trình học tập của bạn. Bạn muốn hỏi về chất nào?`,
      suggestions: ["Phản ứng của Na + H2O", "KMnO4 là gì?", "Bài học hôm nay"]
    };
  }

  handleRoleCheck(role) {
    const roles = {
      student: "Bạn đang ở chế độ Học sinh. Tôi sẽ giúp bạn thực hành thí nghiệm an toàn và hoàn thành các bài tập.",
      teacher: "Chào đồng nghiệp! Bạn đang ở chế độ Giáo viên. Tôi có dữ liệu về tiến độ lớp học và các giáo án trực quan.",
      admin: "Truy cập tối cao đã được xác nhận. Chào Admin, tôi sẵn sàng báo cáo tình trạng hệ thống."
    };
    return { message: roles[role] || "Tôi chưa xác định được vai trò của bạn." };
  }

  handleReactionPrediction(query) {
    // Extract formulas (e.g., "Na + H2O")
    const parts = query.split(/\s*[\+\s\bvới]\s*/).map(p => normalizeFormula(p)).filter(p => p.length > 0);
    
    // Check if we have an exact match in DB
    const match = this.reactions.find(rx => {
      const rxReactants = rx.reactants.map(r => normalizeFormula(r.formula));
      return rxReactants.length === parts.length && parts.every(p => rxReactants.includes(p));
    });

    if (match) {
      return {
        message: `Dựa trên dữ liệu, ${match.equation} là một phản ứng ${match.type}.\nHiện tượng: ${match.observation}`,
        data: match,
        type: 'reaction'
      };
    }

    // ML SIMULATION: If not in DB, predict using properties
    if (parts.length === 2) {
      // Very simplified logic: Metal + Acid/Water, etc.
      const el1 = this.elements.find(e => normalizeFormula(e.symbol) === parts[0]);
      if (el1 && el1.category === 'alkali-metal' && (parts[1] === 'H2O' || parts[1] === 'H2O')) {
        return {
          message: `🤖 [AI Predictor]: Tôi dự đoán ${el1.name} sẽ phản ứng MÃNH LIỆT với Nước tạo ra dung dịch kiềm và khí Hydro. Đây là đặc tính chung của Kim loại kiềm.`,
          confidence: 0.92
        };
      }
    }

    return {
      message: "Tôi chưa tìm thấy phản ứng chính xác này trong thư viện, nhưng tôi có thể nghiên cứu các thuộc tính của chúng cho bạn.",
      suggestions: ["Na + Cl2", "Fe + HCl", "Cu + AgNO3"]
    };
  }

  handleElementInfo(el) {
    return {
      message: `${el.name} (${el.symbol}) là một ${el.category}. ${el.desc}`,
      data: el,
      type: 'element',
      actions: [{ label: "Xem trong bảng tuần hoàn", link: "/periodic-table" }]
    };
  }

  handleChemicalInfo(query) {
    // Search in reactions as product or reactant
    const related = this.reactions.filter(rx => 
      rx.reactants.some(r => normalizeFormula(r.formula) === normalizeFormula(query)) ||
      rx.products.some(p => normalizeFormula(p.formula) === normalizeFormula(query))
    );

    if (related.length > 0) {
      return {
        message: `${query} xuất hiện trong ${related.length} phản ứng hóa học mà tôi biết. Bạn muốn xem cách tạo ra nó hay cách nó phản ứng?`,
        actions: [
          { label: "Xem cách điều chế", action: "synthesis" },
          { label: "Xem tính chất hóa học", action: "properties" }
        ]
      };
    }
    return null;
  }

  handleLessonHelp(role) {
    if (role === 'teacher') {
      return { message: "Bạn có 2 lớp học cần chấm bài trong hôm nay. Tôi đã soạn sẵn các gợi ý phản hồi cho sinh viên." };
    }
    return { 
      message: "Bạn đang theo lộ trình Hóa học lớp 10. Bài học tiếp theo là 'Cấu tạo nguyên tử'. Bạn muốn bắt đầu ngay?",
      actions: [{ label: "Bắt đầu bài học", link: "/lessons" }]
    };
  }

  findElement(q) {
    return this.elements.find(e => 
      e.name.toLowerCase() === q || 
      e.symbol.toLowerCase() === q ||
      normalizeFormula(e.symbol) === normalizeFormula(q)
    );
  }

  findChemical(q) {
    // Search in reaction formulas
    for (let rx of this.reactions) {
      for (let r of rx.reactants) if (normalizeFormula(r.formula) === normalizeFormula(q)) return r.formula;
      for (let p of rx.products) if (normalizeFormula(p.formula) === normalizeFormula(q)) return p.formula;
    }
    return null;
  }
}

export const AurumExpert = new AurumExpertEngine();
export default AurumExpert;
