import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/theme';

export default function InfographicImage({ uri, title, style, onError }) {
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [ratio, setRatio] = React.useState(0.7);
  const { width } = useWindowDimensions();
  React.useEffect(() => {
    let active = true;
    Image.getSize(uri, (w, h) => { if (active && w > 0 && h > 0) setRatio(w / h); }, () => {});
    return () => { active = false; };
  }, [uri]);
  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={`Phóng to tranh kiến thức: ${title}`} onPress={() => { setZoom(1); setOpen(true); }}>
      <Image source={{ uri }} style={style} resizeMode="contain" onError={onError} />
      <Text style={styles.hint}>Chạm để phóng to</Text>
    </Pressable>
    <Modal visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.toolbar}>
          <Text numberOfLines={2} style={styles.title}>{title}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Đóng ảnh phóng to" onPress={() => setOpen(false)} style={styles.button}><Ionicons name="close" size={26} color="#ffffff" /></Pressable>
        </View>
        <ScrollView maximumZoomScale={4} minimumZoomScale={1} contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView horizontal contentContainerStyle={{ alignItems: 'center' }}>
            <Image source={{ uri }} resizeMode="contain" style={{ width: width * zoom, height: width * zoom / ratio }} />
          </ScrollView>
        </ScrollView>
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" accessibilityLabel="Thu nhỏ" disabled={zoom <= 1} style={styles.button} onPress={() => setZoom((value) => Math.max(1, value - 0.5))}><Ionicons name="remove" size={26} color="#ffffff" /></Pressable>
          <Text style={styles.zoom}>{Math.round(zoom * 100)}%</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Phóng to" disabled={zoom >= 4} style={styles.button} onPress={() => setZoom((value) => Math.min(4, value + 0.5))}><Ionicons name="add" size={26} color="#ffffff" /></Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f172a' }, toolbar: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  title: { flex: 1, color: '#ffffff', fontFamily: typography.bold, fontSize: 17 }, button: { height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#334155' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, padding: 12 }, zoom: { color: '#ffffff', fontFamily: typography.bold },
  hint: { color: '#437d0c', fontSize: 12, textAlign: 'center', fontFamily: typography.bold, padding: 8 },
});
