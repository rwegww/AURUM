import React from 'react';
import { View, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import mathStyles from '../../assets/math/styles.json';
import { renderTheoryMarkup, THEORY_CSS } from './theoryMarkup';

export default function TheoryContent({ modules }) {
  const [height, setHeight] = React.useState(200);
  const html = React.useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${mathStyles}${THEORY_CSS}html,body{padding:0;margin:0;background:transparent}</style></head><body><article id="content" class="aurum-theory">${renderTheoryMarkup(modules)}</article><script>
    const report=()=>window.ReactNativeWebView.postMessage(String(Math.ceil(document.getElementById('content').getBoundingClientRect().height)+16));new ResizeObserver(report).observe(document.getElementById('content'));document.fonts.ready.then(report);report();
  </script></body></html>`, [modules]);
  return <View style={{ height, width: '100%' }}><WebView source={{ html }} originWhitelist={['*']} scrollEnabled={false} style={{ height, backgroundColor: 'transparent' }}
    onShouldStartLoadWithRequest={(request) => {
      if (request.url === 'about:blank' || request.url.startsWith('data:text/html')) return true;
      if (request.isTopFrame !== false && /^(https?:|mailto:)/i.test(request.url)) Linking.openURL(request.url).catch(() => {});
      return false;
    }}
    onMessage={(event) => { const value = Number(event.nativeEvent.data); if (Number.isFinite(value) && value > 0) setHeight(Math.ceil(value)); }} /></View>;
}
