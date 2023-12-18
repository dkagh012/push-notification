import React, { useRef, useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, BackHandler } from "react-native";

export default function Home({ route }) {
  const { expoPushToken } = route.params;
  const webview = useRef();

  const onPressHardwareBackButton = () => {
    if (webview.current) {
      webview.current.goBack();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      onPressHardwareBackButton
    );
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        onPressHardwareBackButton
      );
    };
  }, []);
  return (
    <WebView
      ref={webview}
      style={styles.container}
      source={{
        uri: `http://192.168.50.83:5501/assets/index.html?token=${expoPushToken.data}`,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
