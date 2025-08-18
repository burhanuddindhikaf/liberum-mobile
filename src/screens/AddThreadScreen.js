// screens/AddThreadScreen.js
import React, { useState, useEffect } from "react";
import { ScrollView, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import api from "../api"; // pastikan path benar

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import * as ImagePicker from "expo-image-picker";

export default function AddThreadScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data?.data) setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Pilih gambar dari galeri
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Izin akses galeri dibutuhkan!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Submit thread
  const handleSubmit = async () => {
    if (!title || !body || !category) {
      alert("Harap isi semua field yang wajib!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("category_id", category);

      // upload 1 file (opsional)
      if (image) {
        formData.append("images[]", {
          uri:
            Platform.OS === "android"
              ? image.uri
              : image.uri.replace("file://", ""),
          type: "image/jpeg",
          name: "thread-image.jpg",
        });
      }

      const res = await fetch(`${api.defaults.baseURL}/threads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // penting: jangan set "Content-Type", biarkan fetch yg set otomatis dgn boundary
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response:", errorText);
        throw new Error("Gagal menambahkan thread");
      }

      alert("Thread berhasil ditambahkan!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#F9FAFB" }}>
      <Heading mb={6} size="xl" style={{ color: "#111827" }}>
        Tambah Thread
      </Heading>

      {/* Input Judul */}
      <Box
        mb={5}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      >
        <Input>
          <InputField
            placeholder="Judul Thread"
            value={title}
            onChangeText={setTitle}
            style={{ fontSize: 16, color: "#111827" }}
          />
        </Input>
      </Box>

      {/* Select Kategori */}
      <Box
        mb={5}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      >
        <Select onValueChange={(val) => setCategory(val)}>
          <SelectTrigger
            variant="outline"
            size="md"
            style={{ borderRadius: 10, borderColor: "#D1D5DB", height: 48 }}
          >
            <SelectInput placeholder="Pilih Kategori" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    label={cat.name}
                    value={String(cat.id)}
                  />
                ))
              ) : (
                <SelectItem label="Tidak ada kategori" value="" />
              )}
            </SelectContent>
          </SelectPortal>
        </Select>
      </Box>

      {/* Deskripsi */}
      <Box
        mb={5}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      >
        <Textarea size="md">
          <TextareaInput
            placeholder="Deskripsi thread..."
            value={body}
            onChangeText={setBody}
            style={{ fontSize: 16, color: "#111827", minHeight: 100 }}
          />
        </Textarea>
      </Box>

      {/* Pilih / Hapus Gambar */}
      <Box mb={10}>
        <Button
          onPress={pickImage}
          style={{
            backgroundColor: "#fbbf24",
            borderRadius: 10,
            paddingVertical: 1,
          }}
        >
          <ButtonText style={{ color: "#fff", fontWeight: "600" }}>
            {image ? "Ganti Gambar" : "Pilih Gambar (Opsional)"}
          </ButtonText>
        </Button>

        {image && (
          <Box
            mt={3}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
            }}
          >
            <Image
              source={{ uri: image.uri }}
              style={{ width: "100%", height: 220, borderRadius: 12 }}
            />
            <Button
              variant="outline"
              onPress={() => setImage(null)}
              style={{ marginTop: 8, borderColor: "#EF4444", borderRadius: 10 }}
            >
              <ButtonText style={{ color: "#EF4444" }}>Hapus Gambar</ButtonText>
            </Button>
          </Box>
        )}
      </Box>

      {/* Submit Button */}
      <Button
        onPress={handleSubmit}
        isDisabled={loading}
        style={{
          backgroundColor: "#fbbf24",
          borderRadius: 12,
          paddingVertical: 1,
          marginBottom: 30,
          marginTop: 20,
        }}
      >
        <ButtonText style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          {loading ? "Mengirim..." : "Tambah Thread"}
        </ButtonText>
      </Button>
    </ScrollView>
  );
}
