import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
export default function LoginScreen({ navigation }) {
  const [username, onChangeUsername] = useState("");
  const [password, onChangePassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // Initial role

  const onPressSubmit = async () => {
    console.log(selectedRole);
    const platform = Platform.OS;
    try {
      const response = await fetch("http://192.168.50.211:8000/AddLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          platform,
          role: selectedRole, // Include the selected role
        }),
      });
      console.log("연결 상태:", response.status);
      navigation.navigate("login");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginHeaderText}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        secureTextEntry
        // keyboardType="numeric"
      />
      <Picker
        selectedValue={selectedRole}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
      >
        <Picker.Item label="User" value="user" color="black" />
        <Picker.Item label="Admin" value="admin" color="black" />
      </Picker>
      <Pressable style={styles.button} onPress={onPressSubmit}>
        <Text style={styles.text}>로그인</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loginHeaderText: {
    fontSize: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 280,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    width: 280,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
    color: "white", // Add this line to set the text color
    backgroundColor: "black",
  },
});
