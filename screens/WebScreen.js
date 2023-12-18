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
import { useNavigation } from "@react-navigation/native";

export default function WebScreen({ route }) {
  const { expoPushToken } = route.params;
  const webview = useRef();
  const navigation = useNavigation();

  const onPressHardwareBackButton = () => {
    webview.current.goBack();
    return true;
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
