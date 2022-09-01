import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default function useNotifications() {
	useEffect(() => {
		registerForPushNotifications();
	}, []);
}

async function registerForPushNotifications() {
	const storedToken = await AsyncStorage.getItem("expoPushToken");
	if (storedToken) return storedToken;

	const { status } = await Notifications.getPermissionsAsync();
	if (status !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		if (status !== "granted") return;
	}

	const { data: token } = await Notifications.getExpoPushTokenAsync();
	await AsyncStorage.setItem("expoPushToken", token);
}
