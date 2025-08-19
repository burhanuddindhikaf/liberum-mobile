// screens/ThreadDetailScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import PostCard from "@/components/PostCard";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";

export default function ThreadDetailScreen({ route }) {
  const { id } = route.params;
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      // Ambil detail thread
      const threadRes = await api.get(`/threads/${id}`);
      setThread(threadRes.data.data);

      // Ambil semua reply
      const replyRes = await api.get("/reply");
      const rawData = Array.isArray(replyRes.data)
        ? replyRes.data
        : Array.isArray(replyRes.data?.data)
        ? replyRes.data.data
        : [];

      const filteredData = rawData.filter(
        (item) => String(item.replyable_id) === String(id)
      );

      const processedData = filteredData.map((item) => ({
        id: item.id,
        body: item.body,
        replyable_id: item.replyable_id,
        author_name: item.author?.name || "Unknown",
        avatar_url: item.author?.avatar_url || null,
        created_at: item.created_at,
        thumbnail_url: item.media?.[0]?.path
          ? `http://192.168.0.103:8000/storage/${item.media[0].path}`
          : null,
      }));

      setReply(processedData);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await api.post(
        "/reply",
        {
          body: newComment,
          replyable_type: "threads",
          replyable_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchData(); // refresh daftar komentar
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!thread) return <Text>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={{ flex: 1 }}>
        {/* List thread + komentar */}
        <FlatList
          ListHeaderComponent={
            <View style={{ padding: 10 }}>
              <PostCard
                authorName={thread.author?.name || "Unknown"}
                title={thread.title}
                body={thread.body}
                thumbnail_url={thread.media?.[0]?.thumbnail_url || null}
                date={thread.created_at || "Unknown date"}
              />
              <Heading style={{ marginTop: 20 }}>Komentar</Heading>
            </View>
          }
          data={reply}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard
              authorName={item.author_name}
              body={item.body}
              thumbnail_url={item.thumbnail_url || null}
              date={item.created_at || "Unknown date"}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }} // paddingBottom supaya tidak ketutup tombol
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {/* Input komentar */}
        <View
          style={{
            padding: 10,
            marginBottom: 40,
            borderTopWidth: 1,
            borderColor: "#E5E7EB",
            backgroundColor: "#fff",
          }}
        >
          <Input>
            <InputField
              placeholder="Tulis komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.nativeEvent.text)}
            />
          </Input>
          <Button
            onPress={handleAddComment}
            isDisabled={loading}
            style={{
              marginTop: 10,
              backgroundColor: "#fbbf24",
              borderRadius: 10,
            }}
          >
            <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
              {loading ? "Mengirim..." : "Kirim"}
            </ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
