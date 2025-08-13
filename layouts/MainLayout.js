import React, { useState } from "react";
import { View } from "react-native";
import BottomNavbar from "../components/BottomNavbar";
import DrawerMenu from "../components/DrawerMenu";

export default function MainLayout({ children }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Drawer di layout */}
      <DrawerMenu isOpen={showDrawer} onClose={() => setShowDrawer(false)} />

      {/* Konten screen */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Navbar selalu di bawah */}
      <BottomNavbar onOpenDrawer={() => setShowDrawer(true)} />
    </View>
  );
}
