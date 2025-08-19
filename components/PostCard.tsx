import React, { Component, useEffect } from "react";
import { Pressable } from "react-native";
import { Image } from "@/components/ui/image";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { formatRelativeTime } from "../utils";
import userpng from "../assets/user.png"; // Pastikan path ini benar

interface PostCardProps {
  date: string;
  title: string;
  body: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  avatarInitials?: string;
  category?: string;
  thumbnail_url?: string;
  onPress?: () => void;
}

export default function PostCard({
  date,
  title,
  body,
  authorName,
  authorRole,
  avatarUrl,
  avatarInitials,
  category,
  thumbnail_url,
  onPress,
}: PostCardProps) {
  // Debug: cek URL gambar
  useEffect(() => {
    console.log("Thumbnail URL:", thumbnail_url);
    console.log("Avatar URL:", avatarUrl);
  }, [thumbnail_url]);

  return (
    <Pressable onPress={onPress} android_ripple={{ color: "#ddd" }}>
      <Card className="p-5 rounded-lg  m-3">
        {/* Avatar + Nama Author */}
        <HStack className="items-center mb-3 justify-between">
          <HStack className="items-center">
            <Avatar className="mr-3">
              <AvatarFallbackText>
                <Text>
                  {avatarInitials || authorName.slice(0, 2).toUpperCase()}
                </Text>
              </AvatarFallbackText>

              <AvatarImage source={userpng} alt={`${authorName} avatar`} />
            </Avatar>
            <Heading size="sm">{authorName}</Heading>
          </HStack>
          {category && (
            <Pressable
              onPress={() => console.log("Category pressed")}
              className="p-2 bg-green-300 rounded"
            >
              <Text size="sm">{category}</Text>
            </Pressable>
          )}
        </HStack>

        {/* Title */}
        {title && (
          <Heading size="md" className="mb-2">
            {title}
          </Heading>
        )}

        {/* Body (hapus HTML tag) */}
        <Text size="sm" className="mb-3">
          {body.replace(/<[^>]+>/g, "")}
        </Text>

        {/* Render image hanya jika ada thumbnail_url */}
        {thumbnail_url && (
          <Image
            source={{ uri: thumbnail_url }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
              marginTop: 8,
              marginBottom: 8,
            }}
            resizeMode="cover"
          />
        )}

        {/* Date */}
        <Text style={{ color: "gray", marginTop: 6 }}>
          {formatRelativeTime(date)}
        </Text>
      </Card>
    </Pressable>
  );
}
