import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import mathStyles from '../../assets/math/styles.json';
import { escapeHtml, hasMath, renderMathMarkup } from './mathMarkup';

function Formula({ children, style }) {
  const [height, setHeight] = React.useState(36);
  const flat = StyleSheet.flatten(style) || {};
  const html = React.useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${mathStyles}
    html,body{margin:0;padding:0;background:transparent}body{font-family:Nunito,sans-serif;font-size:${Number(flat.fontSize) || 14}px;line-height:1.55;color:${escapeHtml(flat.color || '#334155')};font-weight:${Number(flat.fontWeight) || 400};text-align:${escapeHtml(flat.textAlign || 'left')};overflow-wrap:anywhere}.katex{font-size:1.05em}.katex-display{overflow-x:auto;overflow-y:hidden;margin:0.3em 0}#content{padding:2px 0}
    </style></head><body><div id="content">${renderMathMarkup(children)}</div><script>
    const report=()=>window.ReactNativeWebView.postMessage(String(Math.ceil(document.getElementById('content').getBoundingClientRect().height)));
    new ResizeObserver(report).observe(document.getElementById('content'));document.fonts.ready.then(report);report();
    </script></body></html>`, [children, flat.fontSize, flat.color, flat.fontWeight, flat.textAlign]);
  return <View pointerEvents="none" accessibilityLabel={String(children)} style={{ width: '100%', height }}>
    <WebView source={{ html }} originWhitelist={['*']} scrollEnabled={false} style={{ backgroundColor: 'transparent', height }}
      onShouldStartLoadWithRequest={(request) => request.url === 'about:blank' || request.url.startsWith('data:text/html')}
      onMessage={(event) => { const next = Number(event.nativeEvent.data); if (Number.isFinite(next) && next > 0) setHeight(Math.ceil(next)); }} />
  </View>;
}

export default function MathText({ children, style }) {
  return hasMath(children) ? <Formula style={style}>{children}</Formula> : <Text style={style}>{children}</Text>;
}
