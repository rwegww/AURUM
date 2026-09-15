import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { discussionApi } from '../../services/api';
import { typography } from '../../constants/theme';
import { GhostButton, LoadingState, PrimaryButton } from '../ui/Primitives';

export default function LessonDiscussion({ lessonId }) {
  const { token } = useAuth();
  const [tab, setTab] = React.useState('notes');
  const [note, setNote] = React.useState('');
  const [noteLoaded, setNoteLoaded] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [reply, setReply] = React.useState(null);
  const [expanded, setExpanded] = React.useState({});
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const active = React.useRef(true);
  const busyRef = React.useRef(false);
  React.useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const run = React.useCallback(async (operation) => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError('');
    try { await operation(); }
    catch (failure) { if (active.current) setError(failure.message || 'Không thể thực hiện. Vui lòng thử lại.'); }
    finally { busyRef.current = false; if (active.current) setBusy(false); }
  }, []);
  const loadComments = async (nextPage = 1) => {
    const result = await discussionApi.comments(lessonId, nextPage);
    if (!active.current) return;
    setComments((current) => nextPage === 1 ? result.items : [...current, ...result.items.filter((item) => !current.some((old) => old.id === item.id))]);
    setPage(nextPage); setTotal(result.total); setHasMore(result.hasMore);
  };
  const loadNote = React.useCallback(async () => {
    const result = await discussionApi.note(token, lessonId);
    if (active.current) { setNote(result?.content || ''); setNoteLoaded(true); }
  }, [lessonId, token]);
  React.useEffect(() => { run(loadNote); }, [run, loadNote]);
  const renderComment = (comment, isReply = false) => <View key={comment.id} style={[styles.comment, isReply && styles.reply]}>
    <Text style={styles.author}>{comment.user?.username || 'Chiến binh Hóa học'} <Text style={styles.date}>{comment.created_at ? new Date(comment.created_at).toLocaleDateString('vi-VN') : ''}</Text></Text>
    <Text style={styles.commentText}>{comment.content}</Text>
    <View style={styles.commentActions}>
      <GhostButton label={`♥ ${comment.likes || 0}`} disabled={busy} onPress={() => run(async () => {
        const result = await discussionApi.like(token, comment.id);
        if (active.current) setComments((current) => current.map((item) => item.id === comment.id ? { ...item, likes: result.likes ?? item.likes } : item));
      })} />
      {!isReply ? <GhostButton label="Trả lời" disabled={busy} onPress={() => setReply(comment)} /> : null}
    </View>
  </View>;
  return <View style={styles.container}>
    <View style={styles.tabs}>{[['notes', 'Ghi chú'], ['qna', 'Hỏi đáp']].map(([value, label]) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: tab === value, disabled: busy }} disabled={busy} onPress={() => { setTab(value); setError(''); if (value === 'qna') run(() => loadComments()); else if (!noteLoaded) run(loadNote); }} style={[styles.tab, tab === value && styles.selectedTab]}><Text style={[styles.tabText, tab === value && styles.selectedText]}>{label}</Text></Pressable>)}</View>
    {error ? <View style={styles.error}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>{tab === 'notes' && !noteLoaded ? <GhostButton label="Tải lại ghi chú" disabled={busy} onPress={() => run(loadNote)} /> : tab === 'qna' ? <GhostButton label="Tải lại thảo luận" disabled={busy} onPress={() => run(() => loadComments())} /> : null}</View> : null}
    {tab === 'notes' ? <View style={styles.card}>
      {busy && !noteLoaded ? <LoadingState /> : <>
        <TextInput multiline maxLength={8000} accessibilityLabel="Ghi chú bài học" editable={noteLoaded && !busy} value={note} onChangeText={(value) => { setNote(value); setSaved(false); }} placeholder="Ghi lại những điều bạn đã học..." style={styles.noteInput} textAlignVertical="top" />
        <PrimaryButton label={busy ? 'Đang lưu...' : 'Lưu ghi chú'} disabled={busy || !noteLoaded} onPress={() => run(async () => { await discussionApi.saveNote(token, lessonId, note); if (active.current) setSaved(true); })} />
        {saved ? <Text accessibilityLiveRegion="polite" style={styles.saved}>Đã lưu ghi chú.</Text> : null}
      </>}
    </View> : <>
      <View style={styles.card}>
        {reply ? <View><Text style={styles.saved}>Đang trả lời {reply.user?.username || 'Chiến binh Hóa học'}</Text><GhostButton label="Hủy trả lời" onPress={() => setReply(null)} /></View> : null}
        <TextInput multiline maxLength={2000} accessibilityLabel="Nội dung thảo luận" editable={!busy} value={content} onChangeText={setContent} placeholder="Nhập bình luận..." style={styles.commentInput} />
        <PrimaryButton label="Gửi bình luận" disabled={busy || !content.trim()} onPress={() => run(async () => {
          await discussionApi.post(token, lessonId, content.trim(), reply?.id || null);
          if (active.current) { setContent(''); setReply(null); }
          await loadComments();
        })} />
      </View>
      <Text style={styles.count}>{total} THẢO LUẬN</Text>
      {comments.filter((item) => !item.parent_id).map((comment) => {
        const replies = comments.filter((item) => item.parent_id === comment.id);
        return <View key={comment.id} style={{ gap: 10 }}>{renderComment(comment)}{replies.length ? <GhostButton label={`${expanded[comment.id] ? 'Ẩn' : 'Xem'} ${replies.length} phản hồi`} onPress={() => setExpanded((current) => ({ ...current, [comment.id]: !current[comment.id] }))} /> : null}{expanded[comment.id] ? replies.map((item) => renderComment(item, true)) : null}</View>;
      })}
      {busy ? <LoadingState /> : hasMore ? <GhostButton label="Xem thêm thảo luận" onPress={() => run(() => loadComments(page + 1))} /> : !comments.length ? <Text style={styles.count}>Chưa có thảo luận cho bài học này.</Text> : null}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  container: { gap: 16 }, tabs: { flexDirection: 'row', backgroundColor: '#76c034', borderRadius: 20, padding: 6, gap: 4 }, tab: { flex: 1, paddingVertical: 14, borderRadius: 15, alignItems: 'center' }, selectedTab: { backgroundColor: '#ffffff' }, tabText: { color: '#ffffff', fontFamily: typography.bold }, selectedText: { color: '#76c034' },
  card: { backgroundColor: '#fdfcfb', padding: 18, borderRadius: 24, borderWidth: 1, borderColor: '#faefd4', gap: 12 }, noteInput: { minHeight: 180, fontFamily: typography.regular, fontSize: 16, color: '#1a1a1a', lineHeight: 26 }, commentInput: { minHeight: 80, padding: 14, backgroundColor: '#fffbf0', borderRadius: 18, fontFamily: typography.regular, color: '#1a1a1a', fontSize: 15 },
  comment: { backgroundColor: '#fffbf0', borderRadius: 24, padding: 18, gap: 12, borderWidth: 1, borderColor: '#faefd4' }, reply: { marginLeft: 24 }, author: { fontFamily: typography.bold, fontSize: 14, color: '#1a1a1a' }, date: { fontFamily: typography.regular, fontSize: 11, color: '#94a3b8' }, commentText: { padding: 16, borderRadius: 16, backgroundColor: '#ffffff', fontFamily: typography.regular, color: '#334155', fontSize: 14, lineHeight: 23 }, commentActions: { flexDirection: 'row', justifyContent: 'space-between' },
  saved: { color: '#437d0c', fontFamily: typography.bold, fontSize: 13 }, count: { color: '#64748b', fontFamily: typography.bold, fontSize: 12 }, error: { padding: 16, backgroundColor: '#fff1f2', borderRadius: 16, gap: 10 }, errorText: { color: '#b42318', fontFamily: typography.bold },
});
