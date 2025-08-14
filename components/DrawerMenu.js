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
import { ScrollView } from "react-native";
import api from "../src/api";

export default function DrawerMenu({ isOpen, onClose, onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  console.log("DrawerMenu file ini dipakai!");
  console.log("Props DrawerMenu:", {
    isOpen,
    onClose,
    onCategorySelectType: typeof onCategorySelect,
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const res = await api.get("/categories");
          if (res.data?.data) {
            setCategories(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };
      fetchData();
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
            {/* Tombol Semua Thread */}
            <Button
              variant="outline"
              className="mb-3 border-0"
              onPress={() => onCategorySelect(null)}
              style={{ justifyContent: "flex-start", paddingLeft: 0 }}
            >
              <ButtonText>Semua Thread</ButtonText>
            </Button>

            {/* Daftar kategori dari API */}
            {categories.length > 0 ? (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="mb-3 border-0"
                  onPress={() => onCategorySelect(category.id)}
                  style={{ justifyContent: "flex-start", paddingLeft: 0 }}
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
