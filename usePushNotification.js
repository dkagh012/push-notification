import { useState, useEffect, useReducer, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants"
import { Platform } from "react-native";

export const usePushNotifications = () => {
    Notifications.setNotificationHandler({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldShowBadge: true,
    })

    const [expoPushToken, setExpoPushToken] = useState();
    const [notification, setNotification] = useState();

    const notificationListener = useRef();
    const responseListener = useRef();

    async function registerForPushNotificationAsync(){
        let token;
        if(Device.isDevice) {
          const  { status: exisitingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = exisitingStatus;

          if (exisitingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if(finalStatus !== "granted") {
            alert("Request permission denied.")
            return;
          }

          token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
          });
        } else {
            alert("Must be using a physical device");
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF2317FC"
            })
        }

        return token;
    }

    useEffect(() => {
        registerForPushNotificationAsync().then(token => {
            setExpoPushToken(token)
        })

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
            console.log('Response')
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current)
            Notifications.removeNotificationSubscription(responseListener.current)
        }
    }, [])

    return {
        expoPushToken,
        notification
    }
}