import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../api";
import PostCard from "@/components/PostCard";
import { Heading } from "@/components/ui/heading";

export default function ThreadDetailScreen({ route }) {
  const { id } = route.params;
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState([]); // default array

  // Fetch thread detail
  useEffect(() => {
    api
      .get(`/threads/${id}`)
      .then((res) => {
        setThread(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // Fetch replies
  useEffect(() => {
    api
      .get("/reply")
      .then((res) => {
        const rawData = res.data || [];

        const filteredData = rawData.filter((item) => item.replyable_id === id);

        const processedData = filteredData.map((item) => ({
          id: item.id,
          body: item.body,
          replyable_id: item.replyable_id,
          author_name:
            item.reply_able_relation?.author_relation?.name || "Unknown",
          created_at: item.created_at,
          avatar_url:
            item.reply_able_relation?.author_relation?.profile_photo_url ||
            null,
        }));

        setReply(processedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!thread) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 10 }}>
      <PostCard
        avatarUrl={thread.author?.avatar_url}
        authorName={thread.author?.name || "Unknown"}
        title={thread.title}
        body={thread.body}
        date={thread.created_at || "Unknown date"}
      />
      <Heading>komentar</Heading>
      <FlatList
        data={reply}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            avatarUrl={item.avatar_url}
            authorName={item.author_name}
            body={item.body}
            date={item.created_at || "Unknown date"}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}
