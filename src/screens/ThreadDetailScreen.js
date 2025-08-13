import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import api from "../api";
import PostCard from "@/components/PostCard";
import { Heading } from "@/components/ui/heading";

export default function ThreadDetailScreen({ route }) {
  const { id } = route.params;
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  if (!thread) return <Text>Loading...</Text>;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ padding: 10 }}>
          {/* Post utama */}
          <PostCard
            avatarUrl={thread.author?.avatar_url}
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
          avatarUrl={item.avatar_url}
          authorName={item.author_name}
          body={item.body}
          thumbnail_url={item.thumbnail_url || null}
          date={item.created_at || "Unknown date"}
        />
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
