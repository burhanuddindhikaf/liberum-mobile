import React from "react";
import { Pressable } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { View } from "react-native";
import { formatRelativeTime } from "../utils";

interface PostCardProps {
  date: string;
  title: string;
  body: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  avatarInitials?: string;
  category?: string;
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
  onPress,
}: PostCardProps) {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: "#ddd" }}>
      <Card className="p-5 rounded-lg max-w-[360px] m-3">
        {/* Avatar + Nama Author */}
        <HStack className="items-center mb-3 justify-between">
          <HStack className="items-center">
            <Avatar className="mr-3">
              <AvatarFallbackText>
                {avatarInitials || authorName.slice(0, 2).toUpperCase()}
              </AvatarFallbackText>
              {avatarUrl && (
                <AvatarImage
                  source={{ uri: avatarUrl }}
                  alt={`${authorName} avatar`}
                />
              )}
            </Avatar>
            <Heading size="sm">{authorName}</Heading>
          </HStack>
          {category && (
            <Pressable
              onPress={() => console.log("Hello")}
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
        {/* Date */}
        <Text style={{ color: "gray", marginTop: 6 }}>
          {formatRelativeTime(date)}
        </Text>
      </Card>
    </Pressable>
  );
}
