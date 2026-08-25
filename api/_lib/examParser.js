const QUESTION_TYPES_BY_PART = {
  1: 'multiple_choice',
  2: 'true_false',
  3: 'short_answer',
};

const foldText = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/gi, (character) => (character === 'Đ' ? 'D' : 'd'))
  .replace(/\u00a0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const cleanLine = (value) => String(value ?? '')
  .replace(/\u00a0/g, ' ')
  .replace(/[\t ]+/g, ' ')
  .trim();

const romanToNumber = (value) => {
  if (/^\d+$/.test(value)) return Number(value);

  const romanValues = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const roman = value.toUpperCase();
  let total = 0;
  for (let index = 0; index < roman.length; index += 1) {
    const current = romanValues[roman[index]] || 0;
    const next = romanValues[roman[index + 1]] || 0;
    total += current < next ? -current : current;
  }
  return total || null;
};

const inferQuestionType = (heading, part) => {
  const normalized = foldText(heading).toUpperCase();
  if (/TRAC NGHIEM/.test(normalized)) return 'multiple_choice';
  if (/DUNG\s*[/\u2013\u2014-]?\s*SAI/.test(normalized)) return 'true_false';
  if (/TRA LOI NGAN/.test(normalized)) return 'short_answer';
  if (/TU LUAN/.test(normalized)) return 'essay';
  return QUESTION_TYPES_BY_PART[part] || 'multiple_choice';
};

const parseSectionHeading = (line) => {
  const normalized = foldText(line).toUpperCase();
  const match = normalized.match(/^(PHAN\s+)?([IVXLCDM]+|\d+)\b/);
  if (!match) return null;
  if (!match[1] && !/(?:TRAC NGHIEM|DUNG\s*[/\u2013\u2014-]?\s*SAI|TRA LOI NGAN|TU LUAN)/.test(normalized)) {
    return null;
  }

  const part = romanToNumber(match[2]);
  if (!part) return null;
  return {
    part,
    type: inferQuestionType(normalized, part),
    title: cleanLine(line),
  };
};

const isAnswerBoundary = (line) => {
  const normalized = foldText(line).toUpperCase();
  return /^(?:--+\s*)?HET(?:\s*--+)?$/.test(normalized)
    || /^DAP AN\b/.test(normalized)
    || /^HUONG DAN (?:GIAI|CHAM)\b/.test(normalized)
    || /^(?:PHAN\s+)?(?:[IVXLCDM]+|\d+)\s*[.):-]\s*(?:DAP AN|HUONG DAN (?:GIAI|CHAM))\b/.test(normalized);
};

const parseQuestionStart = (line) => {
  const match = cleanLine(line).match(/^(?:Câu|Bài|C)\s*(\d+)\b(?:\s*\([^)]*\))?\s*[.\-:)]?\s*(.*)$/iu);
  if (!match) return null;
  return { number: Number(match[1]), content: cleanLine(match[2]) };
};

const createQuestion = ({ index, section, number, content }) => {
  const type = section.type;
  return {
    id: `q_${Date.now()}_${index}`,
    part: section.part,
    partNum: number,
    part_title: section.title,
    type,
    content,
    options: type === 'multiple_choice'
      ? { A: '', B: '', C: '', D: '' }
      : (type === 'true_false' ? { a: '', b: '', c: '', d: '' } : undefined),
    correct_answer: type === 'true_false' ? { a: null, b: null, c: null, d: null } : '',
  };
};

const appendQuestionContent = (question, line) => {
  question.content = question.content ? `${question.content}\n${line}` : line;
};

const parseOptions = (question, line) => {
  if (question.type === 'multiple_choice') {
    const regex = /(?:^|\s+)([A-D])\s*[.:)]\s*(.*?)(?=\s+[A-D]\s*[.:)]|$)/gi;
    let matched = false;
    let optionMatch;
    while ((optionMatch = regex.exec(line)) !== null) {
      question.options[optionMatch[1].toUpperCase()] = cleanLine(optionMatch[2]);
      matched = true;
    }
    return matched;
  }

  if (question.type === 'true_false') {
    const regex = /(?:^|\s+)([a-d])\s*[.:)]\s*(.*?)(?=\s+[a-d]\s*[.:)]|$)/gi;
    let matched = false;
    let optionMatch;
    while ((optionMatch = regex.exec(line)) !== null) {
      question.options[optionMatch[1].toLowerCase()] = cleanLine(optionMatch[2]);
      matched = true;
    }
    return matched;
  }

  return false;
};

const parseQuestions = (lines) => {
  const questions = [];
  let section = { part: 1, type: 'multiple_choice', title: 'PHẦN I: TRẮC NGHIỆM' };
  let currentQuestion = null;

  for (const line of lines) {
    const nextSection = parseSectionHeading(line);
    if (nextSection) {
      section = nextSection;
      continue;
    }

    const questionStart = parseQuestionStart(line);
    if (questionStart) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = createQuestion({
        index: questions.length + 1,
        section,
        number: questionStart.number,
        content: questionStart.content,
      });
      continue;
    }

    if (!currentQuestion) continue;
    if (!parseOptions(currentQuestion, line)) appendQuestionContent(currentQuestion, line);
  }

  if (currentQuestion) questions.push(currentQuestion);
  return questions;
};

const isTrueValue = (value) => ['D', 'Đ'].includes(value.toUpperCase());

const parseRawAnswers = (lines) => {
  const answers = new Map();
  let section = null;
  const multipleChoiceNumbers = [];
  const multipleChoiceLetters = [];
  const trueFalseLetters = [];
  const shortAnswers = [];

  for (const line of lines) {
    const nextSection = parseSectionHeading(line);
    if (nextSection) {
      section = nextSection;
      continue;
    }
    if (!section) continue;

    if (section.type === 'multiple_choice') {
      const inlineMatches = [...line.matchAll(/(?:Câu\s*)?(\d+)\s*[.:-]?\s*([A-D])\b/giu)];
      if (inlineMatches.length > 0) {
        inlineMatches.forEach((match) => answers.set(`${section.part}:${Number(match[1])}`, match[2].toUpperCase()));
        continue;
      }
      if (/^(?:\d+\s*)+$/.test(line)) {
        multipleChoiceNumbers.push(...line.split(/\s+/).filter(Boolean).map(Number));
      } else if (/^(?:[A-D]\s*)+$/i.test(line)) {
        multipleChoiceLetters.push(...line.split(/\s+/).filter(Boolean).map((letter) => letter.toUpperCase()));
      }
      continue;
    }

    if (section.type === 'true_false') {
      const match = line.match(/^(?:Câu\s*)?(\d+)\s*[.:-]?\s*([SDĐ\s,;]+)$/iu);
      if (match) {
        const values = match[2].replace(/[^SDĐ]/giu, '').toUpperCase();
        if (values.length === 4) {
          answers.set(`${section.part}:${Number(match[1])}`, Object.fromEntries(
            ['a', 'b', 'c', 'd'].map((key, index) => [key, isTrueValue(values[index])]),
          ));
        }
      } else if (/^(?:[SDĐ]\s*)+$/iu.test(line.replace(/[,;]/g, ' '))) {
        trueFalseLetters.push(...line.replace(/[,;]/g, ' ').split(/\s+/).filter(Boolean).map((letter) => letter.toUpperCase()));
      }
      continue;
    }

    if (section.type === 'short_answer') {
      const match = line.match(/^(?:Câu\s*)?(\d+)\s*[.:-]\s*(-?\d+(?:[.,]\d+)?)$/iu);
      if (match) {
        answers.set(`${section.part}:${Number(match[1])}`, match[2]);
      } else if (/^(?:-?\d+(?:[.,]\d+)?\s*)+$/.test(line)) {
        shortAnswers.push(...line.split(/\s+/).filter(Boolean));
      }
    }
  }

  const multipleChoiceCount = Math.min(multipleChoiceNumbers.length, multipleChoiceLetters.length);
  for (let index = 0; index < multipleChoiceCount; index += 1) {
    answers.set(`1:${multipleChoiceNumbers[index]}`, multipleChoiceLetters[index]);
  }

  for (let index = 0; index + 3 < trueFalseLetters.length; index += 4) {
    answers.set(`2:${(index / 4) + 1}`, Object.fromEntries(
      ['a', 'b', 'c', 'd'].map((key, offset) => [key, isTrueValue(trueFalseLetters[index + offset])]),
    ));
  }

  shortAnswers.forEach((answer, index) => answers.set(`3:${index + 1}`, answer));
  return answers;
};

const decodeHtmlEntities = (value) => String(value ?? '')
  .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&apos;|&#39;/gi, "'");

const htmlToText = (html) => decodeHtmlEntities(String(html ?? '')
  .replace(/<img\b[^>]*>/gi, ' ')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(?:p|div|li|td|th|tr|h[1-6])>/gi, '\n')
  .replace(/<[^>]+>/g, ' '))
  .split('\n')
  .map(cleanLine)
  .filter(Boolean)
  .join('\n');

const parseHtmlTable = (tableHtml) => {
  const rows = [];
  for (const rowMatch of tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...rowMatch[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((cellMatch) => htmlToText(cellMatch[1]));
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
};

const findLastSection = (html) => {
  let section = null;
  htmlToText(html).split('\n').forEach((line) => {
    const candidate = parseSectionHeading(line);
    if (candidate) section = candidate;
  });
  return section;
};

const addTableAnswers = (answers, rows, section) => {
  if (!section || rows.length < 2) return;
  const headers = rows[0].map((cell) => foldText(cell).toUpperCase());

  if (headers[0] === 'CAU' && foldText(rows[1]?.[0]).toUpperCase() === 'DAP AN') {
    for (let column = 1; column < Math.min(rows[0].length, rows[1].length); column += 1) {
      const questionNumber = Number.parseInt(rows[0][column], 10);
      const answer = cleanLine(rows[1][column]);
      if (Number.isInteger(questionNumber) && answer) answers.set(`${section.part}:${questionNumber}`, answer);
    }
    return;
  }

  const questionColumn = headers.findIndex((header) => header === 'CAU');
  const answerColumn = headers.findIndex((header) => (
    ['DAP AN', 'HUONG DAN GIAI', 'HUONG DAN CHAM', 'LOI GIAI'].includes(header)
  ));
  if (questionColumn < 0 || answerColumn < 0) return;

  rows.slice(1).forEach((row) => {
    const questionNumber = Number.parseInt(row[questionColumn], 10);
    const answer = String(row[answerColumn] ?? '').trim();
    if (Number.isInteger(questionNumber) && answer) answers.set(`${section.part}:${questionNumber}`, answer);
  });
};

const parseHtmlTableAnswers = (html) => {
  const answers = new Map();
  if (!html) return answers;

  const marker = [...String(html).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].find((paragraphMatch) => {
    const paragraph = foldText(htmlToText(paragraphMatch[1])).toUpperCase();
    return /^(?:(?:PHAN\s+)?(?:[IVXLCDM]+|\d+)\s*[.):-]\s*)?(?:DAP AN|HUONG DAN (?:GIAI|CHAM))\b/.test(paragraph);
  });
  if (!marker) return answers;

  const answerHtml = String(html).slice(marker.index);
  let cursor = 0;
  let section = null;
  for (const tableMatch of answerHtml.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)) {
    const headingSection = findLastSection(answerHtml.slice(cursor, tableMatch.index));
    if (headingSection) section = headingSection;
    addTableAnswers(answers, parseHtmlTable(tableMatch[0]), section);
    cursor = tableMatch.index + tableMatch[0].length;
  }
  return answers;
};

const applyAnswers = (questions, ...answerMaps) => questions.map((question) => {
  const key = `${question.part}:${question.partNum}`;
  let answer;
  answerMaps.forEach((answerMap) => {
    if (answerMap.has(key)) answer = answerMap.get(key);
  });
  return answer === undefined ? question : { ...question, correct_answer: answer };
});

export const parseExamContent = ({ text, html = '' } = {}) => {
  const lines = String(text ?? '')
    .split(/\r?\n/)
    .map(cleanLine)
    .filter((line) => line && !/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line));

  const answerBoundaryIndex = lines.findIndex(isAnswerBoundary);
  const questionLines = answerBoundaryIndex >= 0 ? lines.slice(0, answerBoundaryIndex) : lines;
  const answerLines = answerBoundaryIndex >= 0 ? lines.slice(answerBoundaryIndex + 1) : [];
  const questions = parseQuestions(questionLines);

  return applyAnswers(
    questions,
    parseRawAnswers(answerLines),
    parseHtmlTableAnswers(html),
  );
};

export const examParserInternals = {
  foldText,
  inferQuestionType,
  isAnswerBoundary,
  parseSectionHeading,
};
