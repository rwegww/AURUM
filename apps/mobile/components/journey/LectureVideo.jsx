import React from 'react';
import { Platform, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { WebView } from 'react-native-webview';
import { getVideoEmbedUrl, isFileVideo, normalizeHttpUrl } from '../../../../shared/videoLinks';

function FileVideo({ url }) {
  const player = useVideoPlayer(url);
  return <VideoView player={player} nativeControls fullscreenOptions={{ enable: true }} style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000000' }} />;
}

export default function LectureVideo({ url, title }) {
  const safeUrl = normalizeHttpUrl(url);
  if (!safeUrl) return null;
  if (isFileVideo(safeUrl)) return <FileVideo key={safeUrl} url={safeUrl} />;
  const src = normalizeHttpUrl(getVideoEmbedUrl(safeUrl));
  return <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000000' }}>
    {Platform.OS === 'web' ? <iframe src={src} title={title} allowFullScreen style={{ width: '100%', height: '100%', border: 0 }} /> : <WebView source={{ uri: src }} allowsFullscreenVideo allowsInlineMediaPlayback style={{ flex: 1 }} />}
  </View>;
}
