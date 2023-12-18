import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { usePushNotifications } from "./usePushNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [username, onChangeUsername] = useState("");
  const [password, onChangePassword] = useState("");
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const loginStatus = await AsyncStorage.getItem("Login");
      const userRole = await AsyncStorage.getItem("userRole");
      if (loginStatus) {
        navigation.navigate("WebScreen", { role: "admin" });
      }
    };
    attemptAutoLogin();
  }, []);

  const onPressSubmit = async () => {
    const platform = Platform.OS;
    const push_notification_token = expoPushToken.data;

    try {
      const response = await fetch(
        "http://192.168.50.211:8000/register-push-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            push_notification_token,
            platform,
            password,
          }),
        }
      );

      console.log(response.ok);
      console.log("연결 상태:", response.status);
      if (response.status === 200) {
        const responseData = await response.json();
        await AsyncStorage.setItem("userRole", `${responseData.userRole.role}`);
        await AsyncStorage.setItem("Login", `${responseData.ok}`);

        if (responseData.userRole.role === "admin") {
          navigation.navigate("WebScreen", { role: "admin" });
        } else if (responseData.userRole.role === "user") {
          navigation.navigate("WebScreen", { role: "admin" });
        }
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
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
});
