import React, { useEffect, useState, useCallback } from "react";
import { FlatList, View } from "react-native";
import api from "../api";
import PostCard from "@/components/PostCard";
import BottomNavbar from "@/components/BottomNavbar";
import DrawerMenu from "@/components/DrawerMenu";

export default function FeedScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchThreads = async (page = 1, reset = false, categoryId = null) => {
    try {
      let url = `/threads?page=${page}`;
      if (categoryId) url += `&category_id=${categoryId}`;

      const res = await api.get(url);
      const newData = Array.isArray(res.data.data) ? res.data.data : [];

      setThreads((prev) => (reset ? newData : [...prev, ...newData]));
      setPage(page); // update page saat load
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error(error);
    }
  };

  // Panggil saat komponen mount
  useEffect(() => {
    fetchThreads(1, true, selectedCategory);
  }, []);

  // Panggil saat kategori berubah
  useEffect(() => {
    fetchThreads(1, true, selectedCategory);
  }, [selectedCategory]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchThreads(1, true, selectedCategory);
    setRefreshing(false);
  }, [selectedCategory]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchThreads(nextPage, false, selectedCategory);
    setPage(nextPage);
    setLoadingMore(false);
  };

  // Fungsi yang dipanggil dari DrawerMenu
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchThreads(1, true, categoryId); // reset list dan load kategori baru

    setDrawerOpen(false); // Tutup drawer setelah pilih kategori
  };

  console.log(
    "FeedScreen render, onCategorySelect:",
    typeof handleCategorySelect
  );

  const filteredFeed = threads.filter((item) => {
    if (!selectedCategory) return true;
    return item.category?.id === selectedCategory;
  });
  console.log("selectedCategory:", selectedCategory);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            avatarUrl={item.author?.profile_photo_url}
            authorName={item.author?.name || "Unknown"}
            title={item.title}
            body={item.body}
            date={item.created_at || "Unknown date"}
            category={item.category?.name || "Uncategorized"}
            thumbnail_url={item.media?.[0]?.thumbnail_url || null}
            onPress={() => navigation.navigate("ThreadDetail", { id: item.id })}
          />
        )}
        contentContainerStyle={{
          paddingVertical: 8,
          paddingBottom: 80,
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Drawer Menu */}
      <DrawerMenu
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCategorySelect={handleCategorySelect}
      />

      {/* Bottom Navbar */}
      <BottomNavbar
        openDrawer={() => setDrawerOpen(true)}
        onCategorySelect={handleCategorySelect}
      />
    </View>
  );
}
