import MarkdownIt from 'markdown-it';
import katex from 'katex';

const markdown = new MarkdownIt({ html: false, breaks: true, linkify: true });
markdown.inline.ruler.before('escape', 'chemistry_math', (state, silent) => {
  const start = state.pos;
  if (state.src[start] !== '$') return false;
  const marker = state.src.startsWith('$$', start) ? '$$' : '$';
  let end = state.src.indexOf(marker, start + marker.length);
  while (end > 0 && state.src[end - 1] === '\\') end = state.src.indexOf(marker, end + marker.length);
  if (end < 0 || end >= state.posMax || end === start + marker.length) return false;
  if (!silent) {
    const token = state.push('chemistry_math', '', 0);
    token.content = state.src.slice(start + marker.length, end);
    token.block = marker === '$$';
  }
  state.pos = end + marker.length;
  return true;
});
markdown.renderer.rules.chemistry_math = (tokens, index) => katex.renderToString(tokens[index].content, {
  displayMode: tokens[index].block, throwOnError: false, trust: false, output: 'html',
});

const format = (text) => String(text ?? '').replace(/\\n/g, '  \n').replace(/\\\s*$/gm, '');
const render = (text) => markdown.render(format(text));

export const renderTheoryMarkup = (modules = []) => (Array.isArray(modules) ? modules : []).map((module) => {
  const content = module?.content || {};
  switch (module?.type) {
    case 'heading': {
      const level = ['h1', 'h2', 'h3', 'h4'].includes(content.level) ? content.level : 'h2';
      const text = format(content.text).replace(/^(?:\d+|[IVXLCDM]+)[.)]\s*/i, '');
      return `<${level}>${markdown.renderInline(text)}</${level}>`;
    }
    case 'paragraph':
    case 'markdown': return `<section>${render(content.text)}</section>`;
    case 'list': return `<ul>${(Array.isArray(content.items) ? content.items : []).map((item) => `<li>${render(item)}</li>`).join('')}</ul>`;
    case 'infoBox':
    case 'warningBox': return `<aside class="${module.type === 'warningBox' ? 'warning' : 'info'}"><h4>${markdown.renderInline(format(content.title))}</h4>${render(content.content)}</aside>`;
    default: return '';
  }
}).join('\n');

export const THEORY_CSS = `
.aurum-theory{font-family:Nunito,sans-serif;color:#1a1a1a;font-size:17px;line-height:1.8;overflow-wrap:anywhere}
.aurum-theory section{margin:0 0 32px}.aurum-theory h1,.aurum-theory h2,.aurum-theory h3{color:#76c034;font-weight:900;line-height:1.25;margin:32px 0 20px}
.aurum-theory>:first-child{margin-top:0}.aurum-theory h1{font-size:36px;border-bottom:2px solid #76c03422;padding-bottom:16px}.aurum-theory h2{font-size:28px}.aurum-theory h3{font-size:24px}
.aurum-theory ul,.aurum-theory ol{padding-left:24px}.aurum-theory li{margin:12px 0}.aurum-theory li::marker{color:#76c034}.aurum-theory li p{margin:0}
.aurum-theory aside{background:#f8fafc;border-left:6px solid #3b82f6;padding:20px;border-radius:16px;margin:32px 0}.aurum-theory aside h4{color:#1d4ed8;font-size:18px;margin:0 0 16px;text-transform:uppercase}.aurum-theory .warning{background:#fff7ed;border-color:#f97316}.aurum-theory .warning h4{color:#c2410c}
.aurum-theory table{display:block;overflow-x:auto;border-collapse:collapse;width:100%;margin:20px 0}.aurum-theory th,.aurum-theory td{border:1px solid #e2e8f0;padding:10px;min-width:80px}.aurum-theory th{background:#f0fdf4}
.aurum-theory img{max-width:100%;height:auto}.aurum-theory pre{overflow:auto;background:#f1f5f9;padding:16px;border-radius:12px}.aurum-theory blockquote{border-left:4px solid #76c034;padding-left:16px;color:#64748b}.aurum-theory a{color:#437d0c}.aurum-theory .katex-display{overflow:auto;max-width:100%}.aurum-theory .katex{font-size:1.05em}
`;
