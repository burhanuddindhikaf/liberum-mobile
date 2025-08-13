import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView } from "react-native"; // Supaya bisa scroll kalau kategori banyak
import api from "../src/api"; // Pastikan path ini sesuai dengan struktur project Anda
import { B } from "@expo/html-elements";

export default function DrawerMenu({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const res = await api.get("/categories"); // Panggil API
          if (res.data?.data) {
            setCategories(res.data.data); // Simpan data ke state
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };

      fetchData(); // Panggil fungsi
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg" anchor="left">
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader className="flex-row justify-between mb-10 mt-5">
          <Heading size="3xl">KATEGORI</Heading>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <ScrollView>
            <Button
              variant="outline"
              className="mb-3 border-0"
              onPress={() => console.log("Kategori dipilih:", "Semua Thread")}
              style={{
                justifyContent: "flex-start", // tulisan ke kiri
                marginLeft: 0,
                paddingLeft: 0, // margin kiri untuk memberi jarak
              }}
            >
              <ButtonText>Semua Thread</ButtonText>
            </Button>
            {categories.length > 0 ? (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="mb-3 border-0"
                  onPress={() =>
                    console.log("Kategori dipilih:", category.name)
                  }
                  style={{
                    justifyContent: "flex-start", // tulisan ke kiri
                    marginLeft: 0,
                    paddingLeft: 0, // margin kiri untuk memberi jarak
                  }}
                >
                  <ButtonText>{category.name}</ButtonText>
                </Button>
              ))
            ) : (
              <Heading size="md">Tidak ada kategori</Heading>
            )}
          </ScrollView>
        </DrawerBody>
        <DrawerFooter>
          <Button onPress={onClose} className="flex-1">
            <ButtonText>Tutup</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
