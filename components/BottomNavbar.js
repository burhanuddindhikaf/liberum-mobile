// components/BottomNavbar.js
import React from "react";
import { HStack, Button, Icon, ButtonText } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DrawerMenu from "./DrawerMenu"; // pastikan path benar

export default function BottomNavbar() {
  const navigation = useNavigation();
  const [showDrawer, setShowDrawer] = React.useState(false);

  return (
    <>
      {/* Drawer Custom */}
      <DrawerMenu isOpen={showDrawer} onClose={() => setShowDrawer(false)} />

      {/* Bottom Nav */}
      <HStack
        bg="$backgroundLight0"
        px="$11"
        py="$2"
        position="absolute"
        bottom={2}
        left={0}
        right={0}
        mx="auto"
        w="100%"
        h={60}
        justifyContent="space-between"
        alignItems="center"
        shadowColor="#000"
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={5}
      >
        {/* Drawer Button */}
        <Button variant="link" onPress={() => setShowDrawer(true)}>
          <ButtonText>
            <Icon as={Ionicons} name="menu" size="xl" color="$textLight800" />
          </ButtonText>
        </Button>

        {/* Add Thread */}
        <Button
          bg="$blue600"
          rounded="$full"
          w={50}
          h={50}
          bottom={10}
          onPress={() => navigation.navigate("AddThread")}
        >
          <Icon as={Ionicons} name="add" size="xl" color="white" />
        </Button>

        {/* Profile */}
        <Button variant="link" onPress={() => navigation.navigate("Profile")}>
          <Icon as={Ionicons} name="person" size="xl" color="$textLight800" />
        </Button>
      </HStack>
    </>
  );
}
