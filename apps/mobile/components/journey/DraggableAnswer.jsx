import React from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DraggableAnswer({ children, disabled, onDrop, label, style }) {
  const offset = React.useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = React.useState(false);
  const current = React.useRef({ disabled, onDrop });
  current.current = { disabled, onDrop };
  const responder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !current.current.disabled,
    onMoveShouldSetPanResponder: () => !current.current.disabled,
    onPanResponderGrant: () => setDragging(true),
    onPanResponderMove: (_, gesture) => offset.setValue(gesture.dy),
    onPanResponderRelease: (_, gesture) => {
      offset.setValue(0); setDragging(false);
      if (!current.current.disabled) current.current.onDrop(gesture.dy);
    },
    onPanResponderTerminate: () => { offset.setValue(0); setDragging(false); },
    onPanResponderTerminationRequest: () => false,
  }), [offset]);
  return <Animated.View style={[style, dragging && styles.dragging, { transform: [{ translateY: offset }] }]}>
    <View {...responder.panHandlers} accessibilityLabel={`Kéo để di chuyển ${label}`} style={styles.handle}>
      <Ionicons name="reorder-three" size={26} color={disabled ? '#cbd5e1' : '#437d0c'} />
    </View>
    {children}
  </Animated.View>;
}

const styles = StyleSheet.create({
  handle: { height: 36, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  dragging: { zIndex: 10, elevation: 8, borderColor: '#58cc02', borderWidth: 2, shadowColor: '#334155', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8 },
});
