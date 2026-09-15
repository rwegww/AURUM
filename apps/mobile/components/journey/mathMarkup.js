import katex from 'katex';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const hasMath = (value) => /\$[^$]+\$/.test(String(value ?? ''));
export const renderMathMarkup = (value) => {
  const text = String(value ?? '');
  const pattern = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let html = '';
  let position = 0;
  for (const match of text.matchAll(pattern)) {
    html += escapeHtml(text.slice(position, match.index)).replace(/\n/g, '<br>');
    html += katex.renderToString(match[1] ?? match[2], { displayMode: Boolean(match[1]), throwOnError: false, trust: false, output: 'html' });
    position = match.index + match[0].length;
  }
  return html + escapeHtml(text.slice(position)).replace(/\n/g, '<br>');
};
