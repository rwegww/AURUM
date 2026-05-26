import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import {
  Card,
  GhostButton,
  IconButton,
  LoadingState,
  Pill,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  TextField
} from "../../components/ui/Primitives";
import { colors, spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { libraryApi } from "../../services/api";
import { useApiResource } from "../../hooks/useApiResource";

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const [content, setContent] = React.useState("");
  const [rating, setRating] = React.useState("5");
  const [submitting, setSubmitting] = React.useState(false);
  const materialId = Array.isArray(id) ? id[0] : id;

  const resource = useApiResource(async () => {
    const [material, feedback] = await Promise.all([
      libraryApi.detail(materialId),
      libraryApi.feedback(materialId).catch(() => [])
    ]);
    return { material, feedback };
  }, [materialId]);

  const material = resource.data?.material;
  const feedback = resource.data?.feedback || [];

  const fileTypeLabel = (type) => {
    if (!type) return "Tệp";
    if (type === "pdf") return "Tài liệu PDF";
    if (type === "image") return "Hình ảnh";
    if (type === "video") return "Video";
    return "Tệp học liệu";
  };

  const openFile = async () => {
    if (!material?.file_url) return;
    const canOpen = await Linking.canOpenURL(material.file_url);
    if (canOpen) {
      await Linking.openURL(material.file_url);
    }
  };

  const submitFeedback = async () => {
    if (!content.trim()) {
      Alert.alert("Thiếu nội dung", "Vui lòng nhập nhận xét ngắn.");
      return;
    }
    setSubmitting(true);
    try {
      await libraryApi.postFeedback(token, materialId, {
        content: content.trim(),
        rating: Number(rating) || 5
      });
      setContent("");
      await resource.reload();
    } catch (error) {
      Alert.alert("Không gửi được phản hồi", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (resource.loading && !resource.data) {
    return <LoadingState label="Đang tải tài liệu..." />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow={material?.category || "Học liệu"}
        title={material?.title || "Tài liệu"}
        subtitle={material?.description || "Chi tiết học liệu từ thư viện AURUM."}
        right={<IconButton icon="arrow-back-outline" onPress={() => router.back()} />}
      />

      <Card accent={colors.green} style={styles.materialCard}>
        <View style={styles.materialTop}>
          <Pill label={fileTypeLabel(material?.file_type)} color={colors.green} icon="document-outline" />
          <Pill label={`${material?.view_count || 0} lượt xem`} color={colors.green} icon="eye-outline" />
        </View>
        <Text style={styles.materialTitle}>{material?.title}</Text>
        <Text style={styles.materialDescription}>
          {material?.description || "Tài liệu này có thể mở trực tiếp từ đường dẫn được lưu trong hệ thống."}
        </Text>
        <PrimaryButton
          label="Mở tài liệu"
          icon="open-outline"
          color={colors.green}
          onPress={openFile}
          disabled={!material?.file_url}
        />
      </Card>

      <SectionTitle title="Gửi đánh giá" />
      <Card style={styles.feedbackForm}>
        <TextField
          icon="chatbubble-outline"
          placeholder="Nhận xét của bạn"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TextField
          icon="star-outline"
          placeholder="Điểm 1-5"
          keyboardType="number-pad"
          value={rating}
          onChangeText={setRating}
        />
        <PrimaryButton
          label={submitting ? "Đang gửi..." : "Gửi đánh giá"}
          icon="send-outline"
          onPress={submitFeedback}
          disabled={submitting}
        />
      </Card>

      <SectionTitle title="Phản hồi gần đây" />
      <View style={styles.stack}>
        {feedback.length > 0 ? feedback.map((item) => (
          <Card key={item.id} style={styles.feedbackCard}>
            <View style={styles.feedbackTop}>
              <Text style={styles.feedbackUser}>{item.users?.username || "Học sinh"}</Text>
              <Pill label={`${item.rating || 5}/5`} color={colors.green} icon="star-outline" />
            </View>
            <Text style={styles.feedbackText}>{item.content}</Text>
            {item.reply_content ? (
              <View style={styles.replyBox}>
                <Text style={styles.replyTitle}>Phản hồi giáo viên</Text>
                <Text style={styles.replyText}>{item.reply_content}</Text>
              </View>
            ) : null}
          </Card>
        )) : (
          <Card>
            <Text style={styles.feedbackText}>Chưa có phản hồi cho tài liệu này.</Text>
          </Card>
        )}
      </View>

      <GhostButton label="Quay lại thư viện" icon="arrow-back-outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  materialCard: {
    gap: spacing.md
  },
  materialTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  materialTitle: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900"
  },
  materialDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600"
  },
  feedbackForm: {
    gap: spacing.md
  },
  stack: {
    gap: spacing.sm
  },
  feedbackCard: {
    gap: spacing.sm
  },
  feedbackTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  feedbackUser: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600"
  },
  replyBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: spacing.md,
    gap: 4
  },
  replyTitle: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  replyText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700"
  }
});
