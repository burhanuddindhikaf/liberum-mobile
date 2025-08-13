import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import api from "../api";
import PostCard from "@/components/PostCard";

export default function FeedScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchThreads = async (pageNum = 1, replace = false) => {
    try {
      const res = await api.get(`/threads?page=${pageNum}`);
      const newData = res.data.data || [];

      if (replace) {
        setThreads(newData);
      } else {
        setThreads((prev) => [...prev, ...newData]);
      }

      // Jika jumlah data yang diambil lebih sedikit dari per_page → berarti sudah habis
      if (newData.length === 0 || newData.length < res.data.per_page) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchThreads(1, true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchThreads(1, true);
    setRefreshing(false);
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchThreads(nextPage);
    setPage(nextPage);
    setLoadingMore(false);
  };

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
          thumbnail_url={item.media?.[0]?.thumbnail_url || null}
          onPress={() => navigation.navigate("ThreadDetail", { id: item.id })}
        />
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5} // Load lebih cepat saat mendekati bawah
    />
  );
}
