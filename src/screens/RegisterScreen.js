import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const onRegister = async () => {
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      await AsyncStorage.setItem("token", res.data.token);
      navigation.replace("Liberum");
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />

      <Button title="Register" onPress={onRegister} />
      <Button
        title="Sudah punya akun? Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: { color: "red", marginBottom: 10 },
});
