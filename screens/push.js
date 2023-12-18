import { StyleSheet, Text, View, Button } from "react-native";
import { usePushNotifications } from "./usePushNotification";
import { sendPushNotification } from "./sendPushNotification"; // 모듈에서 함수를 가져옵니다.

export default function PushScreen() {
  const { expoPushToken } = usePushNotifications();

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(
            expoPushToken,
            "테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트",
            "테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트"
          ); // 가져온 함수를 사용합니다.
        }}
      />
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
});
