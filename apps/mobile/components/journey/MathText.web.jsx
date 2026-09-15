import React from 'react';
import { StyleSheet, Text } from 'react-native';
import mathStyles from '../../assets/math/styles.json';
import { hasMath, renderMathMarkup } from './mathMarkup';

export default function MathText({ children, style }) {
  if (!hasMath(children)) return <Text style={style}>{children}</Text>;
  const flat = StyleSheet.flatten(style) || {};
  return <div style={{ ...flat, fontFamily: 'Nunito, sans-serif', lineHeight: 1.55, width: '100%', overflowWrap: 'anywhere' }}>
    <style>{mathStyles}</style>
    <span dangerouslySetInnerHTML={{ __html: renderMathMarkup(children) }} />
  </div>;
}
