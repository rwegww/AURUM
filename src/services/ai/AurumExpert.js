import { reactions } from '../../data/reactions';
import { elements } from '../../data/elements';
import ReactionML from './ReactionML';
import {
  SAFETY_RESTRICTIONS,
  PEDAGOGICAL_PROMPTS,
  COMMON_ION_MAP,
  VALENCY_MAP,
  OXIDATION_STATE_MAP,
  FLAT_KNOWLEDGE_BASE
} from '../../data/theory';

/**
 * AURUM EXPERT ENGINE — Refactored & Cleaned
 *
 * Core Logic:
 * - Entity Extraction (Elements, Reactions, Ions)
 * - Theory Lookup (Curriculum & General Knowledge)
 * - Neural Prediction for unknown reactions
 * - Safety Guardrails (Aurum Constitution)
 */

const normalizeFormula = (f) => {
  if (!f) return '';
  const map = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
  };
  return f
    .toString()
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => map[m])
    .replace(/\s+/g, '')
    .toUpperCase()
    .trim();
};

const formatSubscripts = (f) => {
  if (!f) return '';
  const map = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return f.toString().replace(/\d/g, (m) => map[m]);
};

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getRandomPrompt = () => PEDAGOGICAL_PROMPTS[Math.floor(Math.random() * PEDAGOGICAL_PROMPTS.length)];

class AurumExpertEngine {
  constructor() {
    this.reactions = reactions;
    this.elements = elements;
    this.theoryDb = FLAT_KNOWLEDGE_BASE;
    this.valencyMap = VALENCY_MAP;
    this.oxidationStateMap = OXIDATION_STATE_MAP;
    this.commonIonMap = COMMON_ION_MAP;
    this.chemicalDict = new Map();
    this.knowledgeIndex = new Map();
    this.init();
    ReactionML.init();
  }

  async init() {
    this.indexElements();
    this.indexReactionChemicals();
    this.indexKnowledge();
  }

  indexElements() {
    this.elements.forEach((el) => {
      const symbol = normalizeFormula(el.symbol);
      const name = (el.name || '').toLowerCase();
      if (symbol) {
        this.chemicalDict.set(symbol, {
          type: 'element',
          data: el,
          name: el.name,
          formula: el.symbol
        });
      }
      if (name) {
        this.chemicalDict.set(name, {
          type: 'element',
          data: el,
          name: el.name,
          formula: el.symbol
        });
      }
    });
  }

  indexReactionChemicals() {
    this.reactions.forEach((rx) => {
      const allChems = [...(rx.reactants || []), ...(rx.products || [])];
      allChems.forEach((c) => {
        const normF = normalizeFormula(c.formula);
        const name = c.name?.toLowerCase();
        if (normF && !this.chemicalDict.has(normF)) {
          this.chemicalDict.set(normF, { type: 'chemical', formula: c.formula, name: c.name });
        }
        if (name && !this.chemicalDict.has(name)) {
          this.chemicalDict.set(name, { type: 'chemical', formula: c.formula, name: c.name });
        }
      });
    });
  }

  indexKnowledge() {
    this.theoryDb.forEach((item) => {
      this.knowledgeIndex.set(item.id, item);
    });
  }

  async ask(query, context = {}) {
    const role = context.user?.role || context.role || 'student';
    const userId = context.user?.id || context.userId;
    const username = context.user?.username || context.username;
    const user_api_key = context.user_api_key || null;
    const chat_history = context.chat_history || [];
    const q = (query || '').toLowerCase().trim();

    if (!q) return this.handleFallback();

    // 0. Local Safety Guardrails (Quick filter)
    if (SAFETY_RESTRICTIONS.some((word) => q.includes(word))) {
      return {
        message: '🛡️ **[Thông báo An toàn Aurum]**\n\nTôi là trợ lý giáo dục và không cung cấp hướng dẫn chế tạo, tối ưu hóa hoặc sử dụng các chất nguy hiểm cho mục đích gây hại.\n\nTôi chỉ có thể hỗ trợ kiến thức lý thuyết an toàn, nhận diện nguy cơ, nguyên tắc bảo hộ và các phản ứng học tập an toàn.',
        safety: 'Danger',
        suggestions: ['An toàn phòng thí nghiệm', 'Kí hiệu cảnh báo hóa chất', 'Phản ứng trung hòa']
      };
    }

    // 1. Specialized Local Lookups (Elements, Reactions) - High speed
    if (q.includes('hóa trị')) {
      const tokens = this.extractChemicals(query);
      if (tokens.length > 0) {
        const result = this.handleValencyRequest(tokens[0]);
        if (result) return result;
      }
    }

    if (q.includes('số oxi hóa')) {
      const tokens = this.extractChemicals(query);
      if (tokens.length > 0) {
        const result = this.handleOxidationStateRequest(tokens[0]);
        if (result) return result;
      }
    }

    if (q.includes('ion')) {
      const ionAnswer = this.tryCommonIonLookup(query);
      if (ionAnswer) return ionAnswer;
    }

    const foundTokens = this.extractChemicals(query);
    const isReactionQuery = q.includes('+') || q.includes('tác dụng') || q.includes('phản ứng') || q.includes('cho vào') || q.includes('dự đoán') || q.includes('tạo ra') || q.includes('điều chế');
    
    if (isReactionQuery) {
      if (foundTokens.length >= 2) {
        const result = this.handleReactionRequest(foundTokens);
        if (result) return result;
      } else if (foundTokens.length === 1) {
        // "Phản ứng có Cl2" - look for reactions containing Cl2
        const result = this.handleReactionDiscovery(foundTokens[0]);
        if (result) return result;
      }
    }

    if (foundTokens.length === 1 && !q.includes('là gì')) {
      const info = this.handleInfoRequest(foundTokens[0]);
      if (info) return info;
    }

    // 2. Local Theory & Curriculum Lookups (High Priority Curated Content)
    const theoryMatch = this.findTheoryMatch(q);
    if (theoryMatch) return this.handleTheoryRequest(theoryMatch);

    if (q.includes('toàn bộ hóa học') || q.includes('sơ đồ hóa học') || q.includes('bản đồ hóa học') || q.includes('bản đồ kiến thức')) {
      return this.handleTheoryById('chemistry-map');
    }

    // 3. Hybrid DB + Gemini Call (The "Brain" upgrade)
    try {
      console.log('🔗 Calling Hybrid AI Engine...');
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          context: { userId, username, role, user_api_key, chat_history } 
        })
      });

      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        // Show the actual error message from backend (e.g. quota exceeded)
        return {
          message: `⚠️ **[Hệ thống AI]**\n\n${result.message || 'Hệ thống đang bận, vui lòng thử lại sau.'}`,
          suggestions: result.error === 'AI Service Temporarily Unavailable' ? ['Thiết lập API Key cá nhân'] : []
        };
      }
    } catch (apiErr) {
      console.warn('⚠️ Hybrid AI Offline, following curriculum lookup:', apiErr.message);
    }

    // 4. Curriculum / Meta triggers (Fallback)
    if (q.includes('vai trò')) return this.handleRoleCheck(role);
    if (q.includes('bài học') || q.includes('lộ trình')) return this.handleLessonHelp(role);

    return this.handleFallback();
  }

  findTheoryMatch(query) {
    return this.theoryDb.find((item) =>
      (item.patterns || []).some((pattern) => query.includes(pattern.toLowerCase()))
    );
  }

  handleTheoryById(id) {
    const item = this.knowledgeIndex.get(id);
    return item ? this.handleTheoryRequest(item) : this.handleFallback();
  }

  handleTheoryRequest(theory) {
    const formulaBlock = theory.formula ? `\n\n$$\n${theory.formula}\n$$` : '';
    const categoryPrefix = theory.category ? `📚 **${theory.category} — ${theory.title}**` : `📚 **${theory.title}**`;
    let actions = theory.actions || [];
    if (theory.id === 'chemistry-map') {
      actions = [{ label: 'Mở Bản Đồ Tương Tác', link: '/knowledge-map' }];
    } else if (theory.id === 'periodic-law') {
      actions = [{ label: 'Mở Bảng Tuần Hoàn', link: '/periodic-table' }];
    }
    
    return {
      message: `${categoryPrefix}${formulaBlock}\n\n${theory.explanation}`,
      actions,
      suggestions: theory.suggestions || []
    };
  }

  handleValencyRequest(token) {
    const symbol = token.formula || token.data?.symbol;
    const valency = this.valencyMap[symbol];

    if (valency) {
      return {
        message: `🌟 **Hóa trị của ${token.name} (${symbol})**\n\nTrong các hợp chất phổ biến, **${token.name}** có hóa trị thường gặp là: **${valency}**.\n\n📖 **Lưu ý:** Hóa trị là cách biểu diễn quen thuộc trong chương trình phổ thông; ở mức sâu hơn thường dùng **số oxi hóa** để phân tích phản ứng oxi hóa – khử.`,
        suggestions: [`Số oxi hóa của ${symbol}`, `Phản ứng có ${symbol}`, `Đặc điểm của ${token.name}`]
      };
    }

    return null;
  }

  handleOxidationStateRequest(token) {
    const symbol = token.formula || token.data?.symbol;
    const ox = this.oxidationStateMap[symbol];

    if (ox) {
      return {
        message: `⚡ **Số oxi hóa thường gặp của ${token.name} (${symbol})**\n\nCác số oxi hóa thường gặp: **${ox.join(', ')}**.\n\n📖 **Nhắc lại:** số oxi hóa giúp nhận diện quá trình oxi hóa – khử và cân bằng phản ứng redox.`,
        suggestions: ['Phản ứng oxi hóa khử', `Hóa trị của ${symbol}`, 'Quy tắc số oxi hóa']
      };
    }

    return this.handleTheoryById('oxidation-number');
  }

  tryCommonIonLookup(query) {
    const normalized = query.replace(/\s+/g, '').toUpperCase();
    const entries = Object.entries(this.commonIonMap);
    const found = entries.find(([key]) => normalized.includes(key.replace(/\s+/g, '').toUpperCase()));
    if (!found) return null;

    const [formula, ion] = found;
    return {
      message: `🧲 **${ion.name} (${formatSubscripts(formula)})**\n\n- **Loại ion:** ${ion.kind === 'cation' ? 'Cation' : 'Anion'}\n- **Điện tích:** ${ion.charge}\n\nĐây là một ion thường gặp trong các bài toán dung dịch, điện li, phản ứng trao đổi và điện hóa.`,
      suggestions: ['Chất điện li là gì?', 'Phản ứng kết tủa', 'Muối là gì?']
    };
  }

  extractChemicals(originalQuery) {
    // We preserve spaces for accurate word boundary detection of short symbols (Na, Cl, etc.)
    const preparedQuery = (originalQuery || '').toLowerCase();
    const sortedKeys = Array.from(this.chemicalDict.keys()).sort((a, b) => b.length - a.length);
    let availableQuery = preparedQuery;
    const matches = [];

    for (const key of sortedKeys) {
      const normKey = key.toLowerCase();
      const isShort = normKey.length <= 2;
      const pattern = isShort
        ? new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(normKey)}(?=[^\\p{L}\\p{N}]|$)`, 'iu')
        : new RegExp(escapeRegExp(normKey), 'iu');

      let match;
      while ((match = pattern.exec(availableQuery)) !== null) {
        let startIndex = match.index;
        if (isShort && match[0].length > normKey.length) {
          const offset = match[0].toLowerCase().indexOf(normKey);
          startIndex += offset;
        }

        matches.push({
          token: this.chemicalDict.get(key),
          start: startIndex,
          end: startIndex + normKey.length
        });

        const blackout = ' '.repeat(normKey.length);
        availableQuery = availableQuery.substring(0, startIndex) + blackout + availableQuery.substring(startIndex + normKey.length);
      }

      if (matches.length >= 8) break;
    }

    const sortedTokens = matches.sort((a, b) => a.start - b.start).map((m) => m.token);
    const unique = [];
    const seen = new Set();

    sortedTokens.forEach((token) => {
      const norm = normalizeFormula(token.formula);
      if (!seen.has(norm)) {
        unique.push(token);
        seen.add(norm);
      }
    });

    return unique;
  }

  handleReactionRequest(tokens) {
    const formulas = tokens.map((t) => normalizeFormula(t.formula));
    const randomPrompt = getRandomPrompt();

    const exact = this.reactions.find((rx) => {
      const reactants = (rx.reactants || []).map((r) => normalizeFormula(r.formula));
      return reactants.length === formulas.length && formulas.every((f) => reactants.includes(f));
    });

    if (exact) {
      return {
        message: `🤖 **Tôi đã tìm thấy phản ứng: ${exact.name}**\n\n📌 **Phương trình:** ${exact.equation}\n\n🔍 **Hiện tượng:** ${exact.observation}\n\n⚠️ **Cảnh báo:** ${exact.safetyWarning}\n\n🎓 **Gợi ý học tập:** ${randomPrompt}`,
        data: exact,
        safety: exact.safetyWarning?.toLowerCase().includes('nguy hiểm') ? 'Caution' : 'Safe',
        type: 'reaction'
      };
    }

    if (tokens.length === 2 && ReactionML?.predict) {
      const prediction = ReactionML.predict(tokens[0], tokens[1]);
      return {
        message: `🤖 **[Neural AI Prediction]**\n\nTôi dự đoán phản ứng này có xác suất xảy ra dựa trên mô hình dữ liệu hiện có.\n\n- **Loại phản ứng:** ${prediction.type}\n- **Độ tin cậy mô hình:** ${(prediction.confidence * 100).toFixed(1)}%\n- **Mức độ an toàn:** ${prediction.safety}\n\n📖 **Giải thích:** ${prediction.explanation}\n\n🎓 **Gợi ý:** ${randomPrompt}`,
        confidence: prediction.confidence,
        safety: prediction.safety,
        type: 'predicted-reaction'
      };
    }

    return null;
  }

  handleInfoRequest(token) {
    const randomPrompt = getRandomPrompt();
    if (token.type === 'element') {
      const el = token.data;
      const valency = this.valencyMap[el.symbol] ? `\n- **Hóa trị thường gặp:** ${this.valencyMap[el.symbol]}` : '';
      const oxidation = this.oxidationStateMap[el.symbol]
        ? `\n- **Số oxi hóa thường gặp:** ${this.oxidationStateMap[el.symbol].join(', ')}`
        : '';

      return {
        message: `🌟 **${el.name} (${el.symbol})**\n\n- **Số hiệu nguyên tử:** ${el.atomic_number || el.number}\n- **Khối lượng nguyên tử / nguyên tử khối:** ${el.atomic_mass || el.weight}\n- **Phân loại:** ${el.category || 'Chưa có dữ liệu'}${valency}${oxidation}\n\n📖 **Mô tả:** ${el.desc || 'Chưa có mô tả chi tiết trong dữ liệu nguyên tố.'}\n\n🎓 **Hỏi Aurum:** ${randomPrompt}`,
        actions: [{ label: 'Xem Chi Tiết Nguyên Tử', link: '/periodic-table' }],
        suggestions: [`Hóa trị của ${el.symbol}`, `Số oxi hóa của ${el.symbol}`, 'Bảng tuần hoàn']
      };
    }

    return {
      message: `🧪 **${token.name} (${formatSubscripts(token.formula)})**\n\nĐây là một chất hóa học có trong thư viện phản ứng hoặc từ điển chất của hệ thống. ${randomPrompt}`,
      suggestions: [`Phản ứng có ${token.formula}`, `${token.name} tác dụng với gì?`, 'Phân loại phản ứng']
    };
  }

  handleReactionDiscovery(token) {
    const symbol = token.formula || token.data?.symbol;
    const found = this.reactions.filter(rx => 
      [...(rx.reactants || []), ...(rx.products || [])].some(c => 
        normalizeFormula(c.formula) === normalizeFormula(symbol) || 
        c.name?.toLowerCase() === token.name?.toLowerCase()
      )
    );

    if (found.length > 0) {
      const list = found.slice(0, 3).map(rx => `- \`${rx.reactants.map(r => r.formula).join(' + ')} \\to ${rx.products.map(p => p.formula).join(' + ')}\``).join('\n');
      return {
        message: `🔍 **Các phản ứng tiêu biểu liên quan đến ${token.name} (${symbol}):**\n\n${list}\n\nBạn muốn xem chi tiết phản ứng nào trong số này?`,
        suggestions: found.slice(0, 3).map(rx => rx.reactants.map(r => r.formula).join(' + '))
      };
    }

    return null;
  }

  handleRoleCheck(role) {
    const roles = {
      student: 'Với vai trò Học sinh, tôi ưu tiên giải thích nền tảng, công thức và gợi ý tự học an toàn.',
      teacher: 'Với vai trò Giáo viên, tôi có thể hỗ trợ thêm mục tiêu bài học, định hướng nội dung và nhắc an toàn thí nghiệm.',
      admin: 'Với vai trò Quản trị, hệ thống đang vận hành ở chế độ ưu tiên an toàn, dữ liệu có cấu trúc và phản ứng tra cứu.'
    };
    return { message: roles[role] || 'Tôi sẵn sàng hỗ trợ bạn với kiến thức hóa học.' };
  }

  handleLessonHelp() {
    return {
      message: 'Lộ trình nên đi theo thứ tự: **nguyên tử → bảng tuần hoàn → liên kết → mol và định lượng → dung dịch → phản ứng → oxi hóa khử → điện hóa → hữu cơ → an toàn phòng thí nghiệm**.',
      actions: [{ label: 'Mở Danh Sách Bài Học', link: '/lessons' }],
      suggestions: ['Cấu tạo nguyên tử', 'Bảng tuần hoàn', 'Mol là gì?']
    };
  }

  handleFallback() {
    const randomElements = [...this.elements].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      message: 'Tôi là Aurum AI. Tôi có thể giải thích kiến thức hóa học nền tảng, tra cứu nguyên tố/chất, tìm phản ứng từ thư viện và dự đoán phản ứng bằng mô hình dữ liệu. Bạn muốn hỏi về chủ đề nào?',
      suggestions: [
        randomElements[0] ? `${randomElements[0].symbol} là gì?` : 'Cấu tạo nguyên tử',
        randomElements[1] ? `Hóa trị của ${randomElements[1].symbol}` : 'Mol là gì?',
        'Phản ứng Na + Cl2',
        'Bản đồ kiến thức hóa học'
      ]
    };
  }
}

export const AurumExpert = new AurumExpertEngine();
export default AurumExpert;