// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import userpng from "../../assets/user.png"; // Pastikan path ini benar

import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Divider,
} from "@gluestack-ui/themed";
import api from "../api"; // pastikan path benar

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me", {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`, // ganti sesuai token login
          },
        });

        const data = res.data;
        setProfile({
          avatar: data.profile_photo_url,
          username: data.username,
          email: data.email,
          joined: new Date(data.created_at).toLocaleDateString("id-ID"),
          posts: data.threads_count ?? 0,
          replies: data.replies_count ?? 0,
        });
      } catch (err) {
        console.log(err);
        setError("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Hapus token / reset state login
    console.log("Logout berhasil");
    navigation.replace("Login"); // ganti sesuai nama screen Login
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#0D8ABC" />
        <Text mt={2}>Memuat profil...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#F7FAFC" }}>
      {/* Ringkasan Profil Public */}
      <Box bg="white" p={4} rounded="lg" shadow={2} mb={6} alignItems="center">
        <Image
          source={userpng}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
          }}
          alt="Avatar"
        />
        <Heading size="md">{profile.username}</Heading>
        <Text fontSize={14} color="gray.500">
          {profile.email}
        </Text>
      </Box>

      {/* Aktivitas Forum */}
      <Box bg="white" p={4} rounded="lg" shadow={2} mb={6}>
        <Heading size="md" mb={4}>
          Aktivitas
        </Heading>
        <VStack space={2}>
          <Text>Postingan: {profile.posts}</Text>
          <Text>Replies: {profile.replies}</Text>
          <Text>Bergabung: {profile.joined}</Text>
        </VStack>
      </Box>

      {/* Tombol Logout */}
      <TouchableOpacity onPress={handleLogout}>
        <Box bg="#E53E3E" py={3} rounded="lg" alignItems="center" shadow={1}>
          <Text color="white" fontWeight="bold">
            Logout
          </Text>
        </Box>
      </TouchableOpacity>
    </ScrollView>
  );
}
