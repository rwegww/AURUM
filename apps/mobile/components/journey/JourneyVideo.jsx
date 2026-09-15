import React from 'react';
import { typography } from '../../constants/theme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { GhostButton, PrimaryButton } from '../ui/Primitives';

export default function JourneyVideo({ url, title, onComplete, onBack }) {
  const [ended, setEnded] = React.useState(false);
  const [retryError, setRetryError] = React.useState('');
  const player = useVideoPlayer(url, (instance) => { instance.loop = false; instance.play(); });
  const { status, error } = useEvent(player, 'statusChange', { status: player.status });
  useEventListener(player, 'playToEnd', () => setEnded(true));
  return (
    <View style={styles.container}>
      <GhostButton label="Quay lại lộ trình" icon="arrow-back" onPress={onBack} color="#ffffff" />
      <Text style={styles.badge}>VIDEO BÀI HỌC · VÒNG 1</Text>
      <Text style={styles.title}>{title}</Text>
      <VideoView player={player} style={styles.video} nativeControls contentFit="contain" fullscreenOptions={{ enable: true }} />
      {status === 'loading' ? <ActivityIndicator color="#ffffff" accessibilityLabel="Đang tải video" /> : null}
      {status === 'error' ? <View style={styles.error}>
        <Text style={styles.copy}>{retryError || error?.message || 'Không thể phát video. Vui lòng thử lại.'}</Text>
        <GhostButton label="Tải lại video" color="#ffffff" onPress={async () => {
          setRetryError('');
          try { await player.replaceAsync(url); player.play(); }
          catch (failure) { setRetryError(failure.message || 'Không thể tải video.'); }
        }} />
      </View> : null}
      <Text style={styles.copy}>{ended ? 'Đã xem xong video. Bạn đã sẵn sàng bước vào thử thách!' : 'Xem hết video để mở câu hỏi vòng 1.'}</Text>
      <PrimaryButton disabled={!ended} label="Bắt đầu câu hỏi vòng 1" icon="arrow-forward" onPress={onComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#020617', borderRadius: 24, padding: 20, gap: 22 },
  badge: { fontFamily: typography.bold, color: '#fbbf24', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title: { fontFamily: typography.black, color: '#ffffff', fontSize: 25, fontWeight: '900', lineHeight: 33 },
  video: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000000', borderRadius: 16 },
  copy: { fontFamily: typography.regular, color: '#cbd5e1', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  error: { gap: 12 },
});
