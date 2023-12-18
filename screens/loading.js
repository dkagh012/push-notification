import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { usePushNotifications } from "./usePushNotification";
import Superman from "../assets/Logo.png";
import * as Progress from "react-native-progress";

export default function LoadingScreen({ navigation }) {
  const [count, setCount] = useState(3);
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      console.log(expoPushToken);
      navigation.navigate("　", { expoPushToken });
    }
  }, [count, expoPushToken, navigation]);

  const progressValue = 1 - count / 3; // Assuming count starts from 20

  return (
    <View style={styles.container}>
      <Image source={Superman} style={styles.logo} />
      <Progress.Bar progress={progressValue} width={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 20,
  },
});
