import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function WebScreen({ route }) {
  const { expoPushToken } = route.params;
  console.log(expoPushToken.data);
  const webview = useRef();
  let changeUrlScript;
  const navigation = useNavigation();

  let count = 0;
  const onPressHardwareBackButton = () => {
    webview.current.goBack();
    return true;
  };

  const onMessageFromWebView = async (event) => {
    const message = event.nativeEvent.data;
    const sidMatch = message.match(/sid=([^;]+)/);
    if (sidMatch) {
      const cookieValue = sidMatch[1];
      try {
        await AsyncStorage.setItem("cookie", cookieValue);
      } catch (error) {
        console.error("Error in AsyncStorage operations:", error);
      }
    } else if (message === "logout") {
      try {
        await AsyncStorage.removeItem("cookie");
        changeUrlScript = `
          window.location.href = "/sfarmer/login?token=${expoPushToken.data}";
        `;
        webview.current.injectJavaScript(changeUrlScript);
      } catch (error) {
        console.error("Error removing cookie from AsyncStorage:", error);
      }
    }
  };

  const initialLoad = async () => {
    const cookie = await AsyncStorage.getItem("cookie");
    count++;
    if ((cookie === null) === false && count === 2) {
      changeUrlScript = `
        window.location.href = "/sfarmer/index.html";
      `;
      webview.current.injectJavaScript(changeUrlScript);
    }
  };

  useEffect(() => {
    initialLoad();
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
  }, [navigation]);

  const renderBackButton = () => {
    return (
      <TouchableOpacity
        onPress={onPressHardwareBackButton}
        style={styles.backButtonContainer}
      >
        <Text style={styles.backButtonText}>
          {Platform.OS === "ios" ? "←" : "←"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webview}
        style={styles.webview}
        source={{
          uri: `http://192.168.50.24:15000/sfarmer/login?token=${expoPushToken.data}`,
        }}
        onMessage={onMessageFromWebView}
        onLoad={initialLoad}
      />
      {renderBackButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  backButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 50 : 30,
  },
});
