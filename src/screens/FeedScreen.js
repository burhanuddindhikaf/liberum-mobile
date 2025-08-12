import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import api from "../api";
import PostCard from "@/components/PostCard";
import { Pressable } from "react-native";

export default function FeedScreen({ navigation }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    api
      .get("/threads")
      .then((res) => {
        console.log(res.data);
        setThreads(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <FlatList
      data={threads}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard
          avatarUrl={item.author?.avatar_url}
          authorName={item.author?.name || "Unknown"}
          title={item.title}
          body={item.body}
          date={item.created_at || "Unknown date"}
          category={item.category?.name || "Uncategorized"}
          onPress={() => navigation.navigate("ThreadDetail", { id: item.id })}
        />
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}
