import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../ui/Primitives';
import PlacementAssessmentModal from './PlacementAssessmentModal';
import { useAuth } from '../../context/AuthContext';
import { learningApi } from '../../services/api';
import { typography } from '../../constants/theme';
import { JOURNEY_GRADE_CARDS, JOURNEY_THEMES } from '../../../../shared/journeyPresentation';

export default function GradeSelection() {
  const { token, user, refreshProfile } = useAuth();
  const { width } = useWindowDimensions();
  const [assessment, setAssessment] = React.useState(null);
  const [startingGrade, setStartingGrade] = React.useState(null);
  const [error, setError] = React.useState('');
  const placement = user?.balancingProgress?.placement;
  const managed = user?.role === 'student' && placement?.required === true;
  const placed = managed && placement.status === 'placed';
  const cards = placed ? JOURNEY_GRADE_CARDS.filter((item) => item.grade === String(placement.assignedGrade)) : JOURNEY_GRADE_CARDS;
  const columns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const cardWidth = (Math.min(width, 1200) - 32 - (columns - 1) * 24) / columns;
  const openGrade = (grade) => router.push({ pathname: '/journey/[grade]', params: { grade } });
  const chooseGrade = async (grade) => {
    if (!managed || placed) { openGrade(grade); return; }
    if (startingGrade) return;
    setStartingGrade(grade); setError('');
    try {
      const response = await learningApi.startPlacement(token, grade);
      if (!response?.assessment?.questions?.length) throw new Error('Chưa tải được câu hỏi đánh giá. Vui lòng thử lại.');
      setAssessment(response.assessment);
    } catch (failure) { setError(failure.message); }
    finally { setStartingGrade(null); }
  };
  return <Screen style={styles.page}>
    <View style={styles.heading}>
      <Text style={styles.title}>{managed && !placed ? 'CHỌN KHỐI ĐỂ BẮT ĐẦU' : 'BẮT ĐẦU HÀNH TRÌNH'}{ '\n' }<Text style={styles.green}>{managed && !placed ? 'HÀNH TRÌNH' : 'HÓA HỌC'}</Text> CỦA BẠN</Text>
      <Text style={styles.subtitle}>{managed && !placed ? 'Chọn khối phù hợp và hoàn thành bài đánh giá kiến thức nền để xác nhận lớp học.' : 'Mỗi cấp độ học là một chặng khám phá mới, giúp bạn đi từ kiến thức nền đến ứng dụng Hóa học trong đời sống.'}</Text>
    </View>
    {managed ? <View style={styles.placement}>
      <Text style={styles.placementTitle}>{placed ? `Đã xác nhận khối ${placement.assignedGrade}` : placement?.lastResult?.passed === false ? 'Hãy chọn lại khối phù hợp hơn' : 'Bạn chưa được xếp lớp'}</Text>
      <Text style={styles.description}>{placed ? 'Bạn có thể tiếp tục toàn bộ hành trình của khối này.' : placement?.lastResult?.passed === false ? `Lần gần nhất đạt ${placement.lastResult.percent}%. Hệ thống gợi ý khối ${placement.lastResult.recommendedGrade}, nhưng quyết định vẫn là của bạn.` : 'Bài đánh giá gồm 7 câu kiến thức nền, cần đạt tối thiểu 70%. Kết quả không trừ điểm hay XP.'}</Text>
    </View> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <View style={styles.grid}>{cards.map((item) => {
      const active = Number(item.grade) <= 8 || managed;
      return <View key={item.grade} style={[styles.card, { width: cardWidth }]}>
        <View><Image source={{ uri: `https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/public${item.image}` }} style={styles.image} />
          <Text style={styles.badge}>LỚP {item.grade}</Text>
          {placed ? <Text style={styles.assigned}>Khối của bạn</Text> : null}
        </View>
        <View style={styles.cardBody}>
          <View style={styles.brand}><View style={[styles.accent, { backgroundColor: JOURNEY_THEMES[item.grade].primary }]} /><Text style={styles.brandText}>AURUM</Text></View>
          <Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.description}>{item.desc}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`${managed && !placed ? 'Chọn khối' : 'Vào hành trình lớp'} ${item.grade}`} disabled={Boolean(startingGrade)} onPress={() => chooseGrade(item.grade)} style={[styles.button, active && styles.activeButton]}>
            {startingGrade === item.grade ? <ActivityIndicator color={active ? '#ffffff' : '#437d0c'} /> : <Text style={[styles.buttonText, active && styles.activeText]}>{managed && !placed ? 'CHỌN KHỐI NÀY' : 'VÀO KHÔNG GIAN HỌC TẬP'} →</Text>}
          </Pressable>
        </View>
      </View>;
    })}
    {!managed || placed ? <View style={[styles.card, { width: cardWidth }]}>
      <Image source={{ uri: 'https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/public/assets/images/classroom/grade10-viet.png' }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.brandText}>BẢN ĐỒ KIẾN THỨC</Text><Text style={styles.cardTitle}>Cây Kiến Thức Tổng</Text>
        <Text style={styles.description}>Hệ thống hóa toàn bộ kiến thức hóa học từ lớp 8 đến 12</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Mở cây kiến thức tổng" onPress={() => router.push('/knowledge-map')} style={styles.button}><Text style={styles.buttonText}>KHÁM PHÁ BẢN ĐỒ →</Text></Pressable>
      </View>
    </View> : null}</View>
    <PlacementAssessmentModal visible={Boolean(assessment)} assessment={assessment} onClose={() => setAssessment(null)} onSubmit={(payload) => learningApi.submitPlacement(token, payload)}
      onPassed={async (result) => { await refreshProfile(); setAssessment(null); openGrade(String(result.grade)); }}
      onFailed={async () => { await refreshProfile(); setAssessment(null); }} />
  </Screen>;
}
const styles = StyleSheet.create({
  page: { backgroundColor: '#f2faed', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 16, paddingTop: 28, paddingBottom: 40, gap: 24 },
  heading: { alignItems: 'center', gap: 20, paddingBottom: 16 }, title: { fontFamily: typography.black, fontSize: 32, lineHeight: 40, color: '#1a1a1a', textAlign: 'center' }, green: { color: '#76c034' },
  subtitle: { fontFamily: typography.bold, fontSize: 17, lineHeight: 26, textAlign: 'center', color: '#4b5048', maxWidth: 768 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 }, card: { backgroundColor: '#ffffff', borderColor: '#e5e5e5', borderWidth: 2, borderBottomWidth: 5, borderRadius: 24, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 16 / 10, resizeMode: 'cover' }, badge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#ffffff', borderRadius: 30, borderWidth: 2, borderBottomWidth: 4, borderColor: '#e5e5e5', paddingHorizontal: 16, paddingVertical: 6, color: '#1a1a1a', fontFamily: typography.black, fontSize: 11, letterSpacing: 1 },
  assigned: { position: 'absolute', right: 12, top: 16, backgroundColor: '#059669', color: '#ffffff', padding: 8, borderRadius: 20, fontFamily: typography.bold, fontSize: 11 },
  cardBody: { padding: 28, gap: 16, flex: 1 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 8 }, accent: { width: 32, height: 8, borderRadius: 8 }, brandText: { fontFamily: typography.black, fontSize: 10, letterSpacing: 1.5 },
  cardTitle: { color: '#1a1a1a', fontFamily: typography.black, fontSize: 24, lineHeight: 31 }, description: { fontFamily: typography.medium, color: '#555b51', fontSize: 14, lineHeight: 23, flexGrow: 1 },
  button: { borderWidth: 2, borderBottomWidth: 4, borderColor: '#e5e5e5', borderRadius: 16, minHeight: 54, padding: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 }, activeButton: { backgroundColor: '#58cc02', borderColor: '#46a302' },
  buttonText: { fontFamily: typography.black, color: '#1a1a1a', fontSize: 12, textAlign: 'center' }, activeText: { color: '#ffffff' },
  placement: { backgroundColor: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 2, borderRadius: 24, padding: 22, gap: 10 }, placementTitle: { fontFamily: typography.black, fontSize: 20, color: '#0f172a' },
  error: { color: '#b42318', backgroundColor: '#fff1f2', borderRadius: 16, padding: 16, fontFamily: typography.bold },
});
