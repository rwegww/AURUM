import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { buildJourneyPath } from '../../../../shared/journeyLayout';

export default function JourneyRail({ layout, width, highestUnlockedIndex, theme, compact }) {
  // Convert the web's percentage/rem coordinates before drawing. Stroke widths
  // stay in device-independent pixels, just like non-scaling-stroke on the web.
  const pixelLayout = {
    ...layout,
    railPoints: layout.railPoints.map((point) => ({
      x: point.x * width / 100, y: point.y * 16,
      handleX: point.handleX * width / 100, handleY: point.handleY * 16,
    })),
  };
  const path = buildJourneyPath(pixelLayout);
  const progress = buildJourneyPath(pixelLayout, highestUnlockedIndex);
  if (!path || !width) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false}>
      <Svg width={width} height={layout.height * 16}>
        <Path d={path} fill="none" stroke="rgba(75,47,26,0.26)" strokeWidth={compact ? 57.6 : 76.8} strokeLinecap="round" />
        <Path d={path} fill="none" stroke="#bd7c3c" strokeWidth={compact ? 51.2 : 68.8} strokeLinecap="round" />
        <Path d={path} fill="none" stroke="#f5bf6c" strokeWidth={compact ? 41.6 : 56} strokeDasharray={compact ? [10.4, 13.6] : [16, 18.4]} />
        <Path d={path} fill="none" stroke="rgba(255,248,218,0.94)" strokeWidth={compact ? 12.8 : 16.8} strokeLinecap="round" />
        {progress ? <Path d={progress} fill="none" stroke={theme.primary} strokeWidth={compact ? 7.68 : 9.92} strokeLinecap="round" /> : null}
      </Svg>
    </View>
  );
}
