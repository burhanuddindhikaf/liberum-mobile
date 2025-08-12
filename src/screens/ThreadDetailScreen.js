import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../api";

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
      <Text style={{ fontSize: 20 }}>{thread.title}</Text>
      <Text>{thread.body}</Text>
      <Text>By {thread.author.name}</Text>
    </View>
  );
}
