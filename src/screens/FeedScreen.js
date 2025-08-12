import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import api from "../api";

export default function FeedScreen({ navigation }) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    api
      .get("/threads")
      .then((res) => {
        console.log(res.data); // Tambahkan ini
        setThreads(res.data.data);
      })
      .catch((err) => {
        console.log(err); // Tambahkan ini untuk cek error
      });
  }, []);

  return (
    <FlatList
      data={threads}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("ThreadDetail", { id: item.id })}
        >
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Text>By {item.author.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
