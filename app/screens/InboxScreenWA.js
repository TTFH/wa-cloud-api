import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import CardWA from "../components/Card/CardWA";
import InboxHeaderWA from "../components/Header/InboxHeaderWA";
import Screen from "../components/Screen";
import http from "../services/client";
import useNotifications from "../services/notifications";

const test_messages = [
	{
		user_id: "1",
		username: "Test Number",
		channel: "whatsapp",
		unread_count: 1,
		message: {
			incoming: true,
			timestamp: 1660950000,
			caption: "Hello, world! 🌎",
		},
	},
	{
		user_id: "2",
		username: "Juan Perez",
		channel: "whatsapp",
		message: {
			status: "sent",
			timestamp: 1660800000,
			caption: "Look at this kitten 😻",
			image: {},
		},
	},
	{
		user_id: "3",
		username: "Ninja Turbo",
		channel: "whatsapp",
		message: {
			status: "delivered",
			timestamp: 1660700000,
			audio: {},
		},
	},
	{
		user_id: "4",
		username: "Oka Nieba ✈️",
		channel: "whatsapp",
		message: {
			status: "read",
			timestamp: 1660600000,
			caption: "Listen to our beautiful voice",
			video: {},
		},
	},
	{
		user_id: "5",
		username: "Mom ❤️",
		channel: "whatsapp",
		unread_count: 5,
		message: {
			incoming: true,
			timestamp: 1660500000,
			caption: "Dinner is ready.txt",
			document: {},
		},
	},
	{
		user_id: "6",
		username: "Random Dude",
		channel: "whatsapp",
		message: {
			incoming: true,
			timestamp: 1660300000,
			sticker: {},
		},
	},
	{
		user_id: "7",
		username: "Jose Maria Rodriguez",
		channel: "whatsapp",
		message: {
			incoming: true,
			timestamp: 1660200000,
			caption: "Juan Perez",
			contacts: {},
		},
	},
	{
		user_id: "8",
		username: "Tommy",
		channel: "whatsapp",
		message: {
			incoming: true,
			timestamp: 1660200000,
			caption: "This place 🗺️ sucks.",
			location: {},
		},
	},
];

export default function InboxScreenWA({ navigation }) {
	const [messages, setMessages] = useState([]);
	const [unreadTotal, setUnreadTotal] = useState(0);
	useNotifications();

	useEffect(() => {
		http.get("conversations").then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages(test_messages);

			const total_unread = test_messages.reduce((acc, curr) => {
				return acc + (curr.channel == "whatsapp" && curr.unread_count > 0 ? 1 : 0);
			}, 0);
			setUnreadTotal(total_unread);
		});
	}, []);

	Notifications.addNotificationReceivedListener(notification => {
		const notificationData = notification.request.content.data;
		const removeDuplicated = messages.filter(item => item.user_id !== notificationData.user_id);
		setMessages([notificationData, ...removeDuplicated]);
	});

	return (
		<Screen statusBarColor="#008069">
			<InboxHeaderWA navigation={navigation} unread={unreadTotal} />
			<FlatList
				data={messages}
				keyExtractor={(message) => message.user_id}
				renderItem={({ item }) => (
					<CardWA {...item}
						onPress={() => navigation.navigate("ChatWhatsApp", { user_id: item.user_id, username: item.username })}
					/>
				)}
			/>
			<TouchableOpacity onPress={() => navigation.navigate("AddContactWA")}>
				<View style={styles.chatCircle}>
					<MaterialCommunityIcons style={styles.flipX} color="#FFFFFF" name="android-messages" size={25} />
				</View>
			</TouchableOpacity>
		</Screen>
	);
}

const styles = StyleSheet.create({
	chatCircle: {
		alignItems: "center",
		backgroundColor: "#00A884",
		borderRadius: 28,
		bottom: 15,
		elevation: 5,
		height: 56,
		justifyContent: "center",
		position: "absolute",
		right: 15,
		width: 56,
	},
	flipX: {
		transform: [{ scaleX: -1 }],
	},
});
