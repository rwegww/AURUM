import React from 'react';
import { typography } from '../../constants/theme';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState, GhostButton, PrimaryButton, ProgressBar } from '../ui/Primitives';
import JourneyVideo from './JourneyVideo';
import LessonSummary from './LessonSummary';
import MathText from './MathText';
import InfographicImage from './InfographicImage';
import DraggableAnswer from './DraggableAnswer';
import { API_BASE_URL } from '../../services/api';
import { getJourneyQuizGroups, getJourneyVideoUrl } from '../../../../shared/journeyLessonData';
import { getNextJourneyLevel } from '../../../../shared/journeyProgress';
import { getLessonInfographicUrl } from '../../../../shared/lessonAssets';
import { getLessonSummary } from '../../../../shared/lessonSummary';
import { isJourneyAnswerCorrect } from '../../../../shared/journeyAnswers';

const LABELS = { level1: 'Vòng 1: Xem và hiểu', level2: 'Vòng 2: Luyện tập nâng cao', level3: 'Vòng 3: Ôn tập tổng hợp' };
const RESULTS = {
  level1: ['⭐', 'Bạn đã nhận sao thứ nhất!', 'Đã xem xong video và hoàn thành câu hỏi nền tảng.', 'Về lộ trình để học vòng 2'],
  level2: ['🌟', 'Bạn đã nhận sao thứ hai!', 'Bạn đã vượt qua nhóm câu hỏi nâng cao của bài học.', 'Về lộ trình để học vòng 3'],
  level3: ['🎁', 'Hoàn thành trọn vẹn chặng!', 'Bạn đã ôn lại toàn bộ câu hỏi của hai vòng trước và mở khóa phần thưởng.', 'Mở chặng tiếp theo'],
};
const TYPES = { 'multiple-choice': 'Trắc nghiệm', 'image-selection': 'Nhận diện hình ảnh', 'fill-in-the-blank': 'Điền đáp án', 'drag-drop': 'Sắp xếp', matching: 'Ghép cặp', 'lab-task': 'Chuẩn bị thí nghiệm' };
const assetUrl = (value) => value?.startsWith('/') ? `${API_BASE_URL}${value}` : value;

function Question({ question, position, total, title, onCorrect, onMistake }) {
  const [answer, setAnswer] = React.useState(null);
  const [items, setItems] = React.useState(() => [...(question.items || [])].reverse());
  const [feedback, setFeedback] = React.useState(null);
  const timer = React.useRef(null);
  const rowLayouts = React.useRef({});
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const type = question.type;
  const check = (value) => {
    if (feedback !== null) return;
    setAnswer(value);
    const correct = isJourneyAnswerCorrect(question, value);
    setFeedback(correct);
    if (!correct) onMistake();
    timer.current = setTimeout(() => {
      if (correct) onCorrect();
      else { setFeedback(null); setAnswer(null); }
    }, 1200);
  };
  const moveItem = (index, delta) => {
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setItems(next);
  };
  const dropItem = (from, distance) => {
    const origin = rowLayouts.current[from];
    if (!origin) return;
    const center = origin.y + origin.height / 2 + distance;
    const target = items.reduce((best, _, index) => {
      const row = rowLayouts.current[index];
      const difference = row ? Math.abs(row.y + row.height / 2 - center) : Infinity;
      return difference < best.difference ? { index, difference } : best;
    }, { index: from, difference: Infinity }).index;
    if (target === from) return;
    const next = [...items];
    next.splice(target, 0, next.splice(from, 1)[0]);
    setItems(next);
  };
  const selectedStyle = (index) => answer === index ? (feedback === false ? styles.wrong : feedback === true ? styles.correct : styles.selected) : null;
  return <View style={styles.questionShell}>
    <ProgressBar value={position / total} />
    <View style={styles.questionHeader}>
      <View style={styles.typeIcon}><Ionicons name="compass-outline" size={30} color="#5ba315" /></View>
      <View style={styles.headerCopy}><Text style={styles.eyebrow}>{TYPES[type]}</Text><Text style={styles.lessonTitle} numberOfLines={2}>{title}</Text></View>
      <Text style={styles.counter}>{position + 1}/{total}</Text>
    </View>
    <View style={styles.questionBody}>
      <View style={styles.narrativeRow}>
        <Image source={{ uri: 'https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/public/assets/images/characters/professor_mole.png' }} style={styles.mascot} />
        <Text style={styles.narrative}>{question.narrative || 'Hãy sử dụng kiến thức của bạn để hoàn thành thử thách này!'}</Text>
      </View>
      {question.image && type !== 'image-selection' ? <Image source={{ uri: assetUrl(question.image) }} style={styles.questionImage} resizeMode="contain" /> : null}
      <MathText style={styles.questionText}>{question.question || question.content || question.text}</MathText>
      {type === 'multiple-choice' ? <View style={styles.options}>
        {question.options.map((option, index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={String(option)} accessibilityState={{ selected: answer === index, disabled: feedback !== null }} disabled={feedback !== null} onPress={() => check(index)} style={[styles.option, selectedStyle(index)]}><MathText style={styles.optionText}>{String(option)}</MathText></Pressable>)}
      </View> : null}
      {type === 'image-selection' ? <>
        <View style={styles.imageGrid}>{question.images.map((url, index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Hình ${index + 1}`} accessibilityState={{ selected: answer === index }} disabled={feedback !== null} onPress={() => setAnswer(index)} style={[styles.imageOption, selectedStyle(index)]}>
          <Image source={{ uri: assetUrl(url) }} style={styles.choiceImage} resizeMode="cover" /><Text style={styles.imageNumber}>{index + 1}</Text>
        </Pressable>)}</View>
        <PrimaryButton label="Xác nhận lựa chọn" disabled={answer === null || feedback !== null} onPress={() => check(answer)} />
      </> : null}
      {type === 'fill-in-the-blank' ? <>
        <TextInput accessibilityLabel="Câu trả lời" value={answer ?? ''} onChangeText={setAnswer} editable={feedback === null} placeholder={question.placeholder || 'Nhập câu trả lời của bạn'} style={styles.input} onSubmitEditing={() => String(answer ?? '').trim() && check(answer)} />
        <PrimaryButton label="Kiểm tra đáp án" disabled={!String(answer ?? '').trim() || feedback !== null} onPress={() => check(answer)} />
      </> : null}
      {type === 'drag-drop' || type === 'matching' ? <View style={styles.options}>
        <Text style={styles.hint}>{type === 'matching' ? 'Kéo cột bên phải để ghép đúng từng cặp, hoặc dùng mũi tên.' : 'Kéo các mục theo thứ tự đúng, hoặc dùng mũi tên.'}</Text>
        {items.map((item, index) => <View key={item.id ?? index} style={styles.orderRow} onLayout={(event) => { rowLayouts.current[index] = event.nativeEvent.layout; }}>
          {type === 'matching' ? <View style={styles.matchLabel}><MathText>{String(question.leftItems?.[index]?.label ?? question.leftItems?.[index] ?? index + 1)}</MathText></View> : null}
          <DraggableAnswer style={styles.orderItem} label={item.label ?? String(item)} disabled={feedback !== null} onDrop={(distance) => dropItem(index, distance)}><MathText style={styles.orderLabel}>{item.label ?? String(item)}</MathText><View style={styles.arrows}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Di chuyển ${item.label} lên`} disabled={index === 0 || feedback !== null} onPress={() => moveItem(index, -1)} style={[styles.arrowButton, index === 0 && styles.disabled]}><Ionicons name="chevron-up" size={22} color="#437d0c" /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Di chuyển ${item.label} xuống`} disabled={index === items.length - 1 || feedback !== null} onPress={() => moveItem(index, 1)} style={[styles.arrowButton, index === items.length - 1 && styles.disabled]}><Ionicons name="chevron-down" size={22} color="#437d0c" /></Pressable>
          </View></DraggableAnswer>
        </View>)}
        <PrimaryButton label="Xác nhận thứ tự" disabled={feedback !== null} onPress={() => check(items)} />
      </View> : null}
      {type === 'lab-task' ? <PrimaryButton label="Đã hoàn thành nhiệm vụ" disabled={feedback !== null} onPress={() => check(true)} /> : null}
      {feedback !== null ? <Text accessibilityLiveRegion="polite" style={[styles.feedback, { color: feedback ? '#437d0c' : '#b42318' }]}>{feedback ? 'Chính xác! Tiếp tục thôi.' : 'Chưa đúng. Hãy thử lại nhé!'}</Text> : null}
    </View>
  </View>;
}

export default function LessonPlayer({ lesson, lessonStars, onCompleteLevel, onReturn, grade, order }) {
  const [level] = React.useState(() => getNextJourneyLevel(lessonStars));
  const [introDone, setIntroDone] = React.useState(level !== 'level1');
  const [index, setIndex] = React.useState(0);
  const [mistakes, setMistakes] = React.useState(0);
  const [saveState, setSaveState] = React.useState('idle');
  const [saveError, setSaveError] = React.useState('');
  const [imageFailed, setImageFailed] = React.useState(false);
  const savingRef = React.useRef(false);
  const questions = React.useMemo(() => getJourneyQuizGroups(lesson)[level], [lesson, level]);
  const video = getJourneyVideoUrl(lesson);
  const summary = getLessonSummary(lesson);
  const reward = assetUrl(getLessonInfographicUrl(lesson, grade, order));
  const persist = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaveState('saving'); setSaveError('');
    try { await onCompleteLevel(level); setSaveState('saved'); }
    catch (error) { setSaveState('error'); setSaveError(error.message || 'Không thể lưu tiến độ. Vui lòng thử lại.'); }
    finally { savingRef.current = false; }
  };
  const next = () => { if (index + 1 === questions.length) persist(); else setIndex((value) => value + 1); };
  if (!introDone && video) return <JourneyVideo key={video} url={video} title={lesson.title} onComplete={() => setIntroDone(true)} onBack={onReturn} />;
  if (!introDone) {
    const goals = (summary.goals.length ? summary.goals : [lesson.description || 'Nắm ý chính và sẵn sàng bước vào nhiệm vụ khám phá.']).slice(0, 3);
    return <View style={styles.stack}>
      <GhostButton label="Quay lại lộ trình" icon="arrow-back" onPress={onReturn} />
      <View style={styles.briefingHero}>
        <View style={styles.topRow}><Text style={styles.gold}>Chặng {order}</Text><Text style={styles.gold}>Video sẽ bổ sung sau</Text></View>
        <Text style={styles.gold}>NHIỆM VỤ HỌC TẬP</Text><Text style={styles.heroTitle}>{summary.title}</Text><Text style={styles.heroDescription}>{goals[0]}</Text>
        <View style={styles.metrics}>{[[summary.challengeCount || 1, 'Nhiệm vụ'], [getJourneyQuizGroups(lesson).level3.length, 'Câu hỏi'], [summary.concepts.length || summary.keywords.length || 3, 'Ý chính']].map(([value, label]) => <View key={label} style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>)}</View>
      </View>
      <View style={styles.briefing}>
        <Text style={styles.eyebrow}>BRIEFING TRƯỚC BÀI</Text><Text style={styles.title}>Chuẩn bị trước khi vào thử thách</Text>
        {goals.map((goal, i) => <View key={i} style={styles.goal}><Text style={styles.eyebrow}>Mục tiêu {i + 1}</Text><Text style={styles.body}>{goal}</Text></View>)}
        <View style={styles.notice}><Text style={styles.subtitle}>{summary.lab.title}</Text><Text style={styles.body}>{summary.lab.content || summary.applications[0] || 'Ghi lại một ví dụ trong đời sống liên quan đến bài học.'}</Text></View>
        <PrimaryButton label="Bắt đầu câu hỏi vòng 1" icon="arrow-forward" color="#ef4444" onPress={() => setIntroDone(true)} />
      </View>
    </View>;
  }
  if (saveState === 'saving' || saveState === 'error') return <View style={styles.result}>
    {saveState === 'saving' ? <ActivityIndicator size="large" color="#5ba315" /> : <Text style={styles.resultIcon}>⚠️</Text>}
    <Text style={styles.title}>{saveState === 'saving' ? 'Đang lưu mốc sao...' : 'Chưa lưu được tiến độ'}</Text>
    <Text style={styles.body}>{saveState === 'saving' ? 'Vui lòng giữ nguyên màn hình trong giây lát.' : saveError}</Text>
    {saveState === 'error' ? <><PrimaryButton label="Thử lưu lại" onPress={persist} /><GhostButton label="Về lộ trình" onPress={onReturn} /></> : null}
  </View>;
  if (saveState === 'saved') {
    const copy = RESULTS[level];
    return <View style={styles.result}>
      <Text style={styles.resultIcon}>{copy[0]}</Text><Text style={styles.title}>{copy[1]}</Text><Text style={styles.centered}>{copy[2]}</Text>
      <View style={styles.resultMetrics}><View><Text style={styles.hint}>Đã hoàn thành</Text><Text style={styles.resultNumber}>{questions.length}/{questions.length} câu</Text></View><View><Text style={styles.hint}>Lượt trả lời lại</Text><Text style={styles.resultNumber}>{mistakes}</Text></View></View>
      {level === 'level3' ? <View style={styles.reward}>
        <Text style={styles.eyebrow}>Tranh kiến thức đã mở khóa</Text>
        {reward && !imageFailed ? <InfographicImage uri={reward} title={lesson.title} onError={() => setImageFailed(true)} style={styles.rewardImage} /> : <LessonSummary lesson={lesson} />}
      </View> : <Text style={styles.notice}>Đã cộng 1 sao cho vòng này. Hoàn thành đủ 3 sao để nhận tranh kiến thức và mở chặng tiếp theo.</Text>}
      <PrimaryButton label={copy[3]} onPress={onReturn} />
    </View>;
  }
  if (!questions.length) return <View style={styles.stack}><EmptyState title="Mốc sao đang được cập nhật" subtitle="Bài học này chưa có câu hỏi hợp lệ cho mốc hiện tại. Tiến độ sẽ không bị ghi nhận sai." /><GhostButton label="Quay lại lộ trình" onPress={onReturn} /></View>;
  return <View style={styles.stack}>
    <View style={styles.roundBadge}><View><Text style={styles.hint}>ĐANG LÀM</Text><Text style={styles.subtitle}>{LABELS[level]}</Text></View><Text style={styles.starBadge}>+1 sao</Text></View>
    <Question key={index} question={questions[index]} position={index} total={questions.length} title={lesson.title} onCorrect={next} onMistake={() => setMistakes((value) => value + 1)} />
    <GhostButton label="Quay lại lộ trình" icon="arrow-back" onPress={onReturn} />
  </View>;
}

const styles = StyleSheet.create({
  stack: { gap: 18 }, topRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  roundBadge: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e8e8e8', maxWidth: '100%' },
  starBadge: { color: '#b45309', backgroundColor: '#fef3c7', borderRadius: 20, padding: 8, fontWeight: '900' },
  questionShell: { backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 1, borderColor: '#e8e8e8', overflow: 'hidden', padding: 20, gap: 22 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 }, headerCopy: { flex: 1 },
  typeIcon: { width: 44, height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4faef', borderRadius: 14 },
  eyebrow: { fontFamily: typography.black, color: '#437d0c', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2 },
  lessonTitle: { fontFamily: typography.bold, fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginTop: 5 }, counter: { fontFamily: typography.black, color: '#5ba315', fontSize: 16, fontWeight: '900' },
  questionBody: { backgroundColor: '#fcf8f0', padding: 16, borderRadius: 24, gap: 18, borderWidth: 1, borderColor: '#e8e8e8' },
  narrativeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, mascot: { width: 44, height: 52, resizeMode: 'contain' },
  narrative: { fontFamily: typography.regular, flex: 1, backgroundColor: '#ffffff', borderRadius: 14, padding: 12, color: '#667085', fontSize: 13, lineHeight: 20 },
  questionText: { fontFamily: typography.bold, fontSize: 17, lineHeight: 26, color: '#1a1a1a', fontWeight: '800', textAlign: 'center' },
  options: { gap: 10 }, option: { borderWidth: 2, borderColor: '#e8e8e8', backgroundColor: '#ffffff', borderRadius: 18, padding: 16, minHeight: 52, justifyContent: 'center' },
  optionText: { fontFamily: typography.bold, color: '#334155', fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 22 },
  selected: { borderColor: '#5ba315', backgroundColor: '#f4faef' }, correct: { borderColor: '#5ba315', backgroundColor: '#dcfce7' }, wrong: { borderColor: '#ef4444', backgroundColor: '#fee2e2' },
  questionImage: { width: '100%', aspectRatio: 16 / 10 }, imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageOption: { flexBasis: '46%', flexGrow: 1, aspectRatio: 1, borderWidth: 3, borderColor: '#e8e8e8', borderRadius: 16, overflow: 'hidden' }, choiceImage: { width: '100%', height: '100%' },
  imageNumber: { position: 'absolute', top: 8, left: 8, padding: 8, backgroundColor: '#ffffff', borderRadius: 20, fontWeight: '900' },
  input: { fontFamily: typography.regular, borderWidth: 2, borderColor: '#e8e8e8', borderRadius: 16, backgroundColor: '#ffffff', padding: 16, fontSize: 16, textAlign: 'center' },
  orderRow: { flexDirection: 'row', gap: 8, alignItems: 'stretch' }, matchLabel: { fontFamily: typography.regular, flex: 1, backgroundColor: '#e2e8f0', borderRadius: 12, padding: 10, fontSize: 13 },
  orderItem: { flex: 1, borderWidth: 1, borderColor: '#e8e8e8', borderRadius: 12, backgroundColor: '#ffffff', padding: 10 }, orderLabel: { fontFamily: typography.bold, color: '#334155', fontSize: 14, fontWeight: '700' },
  arrows: { flexDirection: 'row', justifyContent: 'flex-end' }, arrowButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.3 },
  feedback: { fontFamily: typography.bold, fontSize: 15, fontWeight: '800', textAlign: 'center' }, hint: { fontFamily: typography.bold, color: '#64748b', fontSize: 10, fontWeight: '700', lineHeight: 16 },
  briefingHero: { backgroundColor: '#020617', borderRadius: 24, padding: 24, gap: 22 }, gold: { fontFamily: typography.black, color: '#fbbf24', fontSize: 12, fontWeight: '900' },
  heroTitle: { fontFamily: typography.black, color: '#ffffff', fontSize: 30, lineHeight: 38, fontWeight: '900' }, heroDescription: { fontFamily: typography.regular, color: '#cbd5e1', fontSize: 16, lineHeight: 27 },
  metrics: { flexDirection: 'row', gap: 10 }, metric: { flex: 1, backgroundColor: '#ffffff15', borderRadius: 16, padding: 12 }, metricValue: { fontFamily: typography.black, color: '#ffffff', fontSize: 24, fontWeight: '900' }, metricLabel: { fontFamily: typography.regular, color: '#cbd5e1', fontSize: 11 },
  briefing: { backgroundColor: '#ffffff', borderRadius: 24, padding: 22, gap: 18 }, goal: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, gap: 6 },
  title: { fontFamily: typography.black, color: '#1a1a1a', fontSize: 24, fontWeight: '900', lineHeight: 31 }, subtitle: { fontFamily: typography.bold, color: '#334155', fontSize: 14, fontWeight: '800' }, body: { fontFamily: typography.regular, color: '#475569', fontSize: 14, lineHeight: 23 },
  notice: { fontFamily: typography.regular, color: '#78350f', backgroundColor: '#fffbeb', padding: 18, borderRadius: 20, fontSize: 14, lineHeight: 23, gap: 8 },
  result: { backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 4, borderColor: '#5ba315', padding: 24, gap: 22 }, resultIcon: { fontFamily: typography.regular, fontSize: 56, textAlign: 'center' }, centered: { fontFamily: typography.regular, color: '#64748b', fontSize: 13, lineHeight: 21, textAlign: 'center' },
  resultMetrics: { flexDirection: 'row', justifyContent: 'space-around', gap: 12, backgroundColor: '#f8fafc', padding: 16, borderRadius: 16 }, resultNumber: { fontFamily: typography.black, color: '#5ba315', fontSize: 20, fontWeight: '900', marginTop: 5 },
  reward: { backgroundColor: '#fcf8f0', borderRadius: 20, padding: 12, gap: 12 }, rewardImage: { width: '100%', height: 420 },
});
