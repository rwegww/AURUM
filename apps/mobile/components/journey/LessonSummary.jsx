import React from 'react';
import { typography } from '../../constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { getLessonSummary } from '../../../../shared/lessonSummary';
import MathText from './MathText';

export default function LessonSummary({ lesson }) {
  const summary = getLessonSummary(lesson);
  return <View style={styles.container}>
    <Text style={styles.title}>{summary.title}</Text>
    <MathText style={styles.copy}>{lesson?.description}</MathText>
    {[
      ['Mục tiêu học tập', summary.goals],
      ['Kiến thức trọng tâm', summary.concepts.map((item) => `${item.title}: ${item.description}`)],
      ['Ứng dụng thực tế', summary.applications],
      ['Lưu ý thường gặp', summary.commonMistakes],
      ['Từ khóa', summary.keywords],
    ].filter(([, items]) => items.length).map(([title, items]) => <View key={title} style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {items.map((item, index) => <MathText key={index} style={styles.copy}>{`• ${item}`}</MathText>)}
    </View>)}
    {summary.lab.content ? <View style={styles.section}><Text style={styles.heading}>{summary.lab.title}</Text><MathText style={styles.copy}>{summary.lab.content}</MathText></View> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: { padding: 18, gap: 14 },
  title: { fontFamily: typography.black, color: '#1e293b', fontSize: 23, lineHeight: 30, fontWeight: '900' },
  heading: { fontFamily: typography.bold, color: '#437d0c', fontSize: 16, fontWeight: '800' },
  section: { gap: 7 },
  copy: { fontFamily: typography.regular, color: '#475569', fontSize: 14, lineHeight: 22 },
});
