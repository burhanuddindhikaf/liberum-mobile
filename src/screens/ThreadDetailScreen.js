import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../api";
import PostCard from "@/components/PostCard";
import { Heading } from "@/components/ui/heading";

export default function ThreadDetailScreen({ route }) {
  const { id } = route.params;
  const [thread, setThread] = useState(null);

  useEffect(() => {
    api.get(`/threads/${id}`).then((res) => {
      setThread(res.data.data);
    });
  }, []);

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
      <Heading>kometar</Heading>
      <PostCard
        avatarUrl={thread.author?.avatar_url}
        authorName={thread.author?.name || "Unknown"}
        title={thread.title}
        body={thread.body}
        date={thread.created_at || "Unknown date"}
      />
    </View>
  );
}
