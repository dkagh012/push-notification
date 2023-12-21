async function sendPushNotification(expoPushToken, title, message) {
  const token = expoPushToken.data;

  try {
    const response = await fetch(
      "http://192.168.50.211:8000/send-notification",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: token, // expoPushToken을 사용합니다
          notification: {
            title: `${title}`,
            message: `${message}`,
          },
        }),
      }
    );
    console.log("FCM Server Response Status:", response.status);
    // 서버 응답에 따른 추가 작업을 여기서 수행할 수 있습니다.
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

// sendPushNotification 함수를 내보냅니다.
export { sendPushNotification };
