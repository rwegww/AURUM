// Bundle KaTeX fonts so formulas also render without a network connection.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const katexDir = path.dirname(require.resolve('katex/package.json'));
let css = fs.readFileSync(path.join(katexDir, 'dist/katex.min.css'), 'utf8');
css = css.replace(/src:[^;}]+/g, (source) => {
  const font = source.match(/url\(([^)]+\.woff2)\)/);
  if (!font) return source;
  const bytes = fs.readFileSync(path.join(katexDir, 'dist', font[1]));
  return `src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2')`;
});
const nunito = fs.readFileSync(require.resolve('@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf'));
css += `@font-face{font-family:Nunito;src:url(data:font/ttf;base64,${nunito.toString('base64')}) format('truetype')}`;
const output = path.join(root, 'assets/math');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'styles.json'), JSON.stringify(css));
fs.copyFileSync(path.join(katexDir, 'LICENSE'), path.join(output, 'KATEX-LICENSE.txt'));
const nunitoDir = path.dirname(require.resolve('@expo-google-fonts/nunito/package.json'));
fs.copyFileSync(path.join(nunitoDir, 'LICENSE_FONT'), path.join(output, 'NUNITO-LICENSE.txt'));
