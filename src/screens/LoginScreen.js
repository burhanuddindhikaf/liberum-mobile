import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      const res = await api.post("/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      navigation.replace("Liberum");
      console.log(res.data.token);
    } catch (err) {
      console.log(err);
      alert("Login gagal");
    }
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={onLogin} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
