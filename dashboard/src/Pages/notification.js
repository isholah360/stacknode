import { isDevice } from "expo-device";
import { openSettings } from "expo-linking";
import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
} from "expo-notifications";
import { Alert } from "react-native";

const generatePushNotificationsToken = async (): Promise<
  string | undefined
> => {
  if (!isDevice) {
    throw new Error(
      "Sorry, Push Notifications are only supported on physical devices."
    );
  }

  const { status: existingStatus } = await getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Error",
      "Sorry, we need your permission to enable Push Notifications. Please enable it in your privacy settings.",
      [
        {
          text: "OK",
        },
        {
          text: "Open Settings",
          onPress: async () => openSettings(),
        },
      ]
    );
    return undefined;
  }

  const { data } = await getExpoPushTokenAsync();

  return data;
};

export default generatePushNotificationsToken;
import generatePushNotificationsToken from "../../utils/expo/generatePushNotificationsToken";

// ...

const { user } = useUser();
const { profile, updateProfile } = useProfile(user);
const [notificationsEnabled, setNotificationsEnabled] =
  useState < boolean > (typeof profile?.expoPushToken === "string");

const toggleNotifications = async (newEnabled: boolean) => {
  setNotificationsEnabled(newEnabled);
  try {
    if (newEnabled && !profile?.expoPushToken) {
      const token = await generatePushNotificationsToken();
      if (!token) {
        setNotificationsEnabled(!newEnabled);
        return;
      }

      await updateProfile({ expoPushToken: token });
    } else if (!newEnabled && profile?.expoPushToken) {
      await updateProfile({ expoPushToken: null });
    }
  } catch (error) {
    setNotificationsEnabled(!newEnabled);
    catchError(error);
  }
};
import useAsync from 'react-use/lib/useAsync';
import { useRef, useState } from 'react';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  AndroidImportance,
  removeNotificationSubscription,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import type { Subscription } from 'expo-modules-core';
import type { Notification, NotificationResponse } from 'expo-notifications';
import { Platform } from 'react-native';

setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const usePushNotifications = (
  onTapNotification?: (response: NotificationResponse) => void
): {
  notification: Notification | null;
} => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useAsync(async () => {
    notificationListener.current =
      addNotificationReceivedListener(setNotification);

    responseListener.current = addNotificationResponseReceivedListener(
      (response) => onTapNotification?.(response)
    );

    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E4780E',
      });
    }

    return () => {
      if (notificationListener.current) {
        removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        removeNotificationSubscription(responseListener.current);
      }
    };
  });

  return { notification };
};

export default usePushNotifications;
const { notification } = usePushNotifications((response) => console.log(response));


import type { ExpoPushMessage } from 'expo-server-sdk';
import { Expo } from 'expo-server-sdk';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

type SendPushNotificationProps = {
  pushToken: string;
  message: string;
};

const sendPushNotification = async ({
  pushToken,
  message,
}: SendPushNotificationProps): Promise<void> => {
  const messages: ExpoPushMessage[] = [];

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  messages.push({
    to: pushToken,
    sound: 'default',
    body: message,
  });

  try {
    await expo.sendPushNotificationsAsync(messages);
  } catch (error) {
    console.error(error);
  }
};

export default sendPushNotification;
const webhook = functions.https.onRequest(async (req, res) => {
    const { uid } = req.body;
    const doc = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
  
    if (!doc.exists) {
      console.log(`No profile found for ${uid}.`);
      return;
    }
  
    console.log(`Found user profile for ${uid}...`);
  
    const data = doc.data();
  
    if (typeof data?.expoPushToken !== 'string') {
      console.log(`No push token found for ${uid}.`);
      return;
    }
  
    console.log(`Sending push notification to ${uid}...`);
  
    await sendPushNotification({
      pushToken: data.expoPushToken,
      message: 'Hello... is this thing working?'
    });
  });
  