import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import CardWA from "../components/CardWA";
import InboxHeaderWA from "../components/Header/InboxHeaderWA";
import Screen from "../components/Screen";
import colors from "../config/colors";
import http from "../services/client";

const test_messages = [
	{
		user_id: "1",
		username: "Test Number",
		channel: "whatsapp",
		unread_count: 1,
		last_message: {
			incoming: true,
			timestamp: 1660950000,
			text: { body: "Hello, world! 🌎" },
		},
	},
	{
		user_id: "2",
		username: "Juan Perez",
		channel: "whatsapp",
		last_message: {
			status: "sent",
			timestamp: 1660800000,
			image: { caption: "Look at this kitten 😻" },
		},
	},
	{
		user_id: "3",
		username: "Ninja Turbo",
		channel: "whatsapp",
		last_message: {
			status: "delivered",
			timestamp: 1660700000,
			audio: {},
		},
	},
	{
		user_id: "4",
		username: "Oka Nieba ✈️",
		channel: "whatsapp",
		last_message: {
			status: "read",
			timestamp: 1660600000,
			video: { caption: "Listen to our beautiful voice" },
		},
	},
	{
		user_id: "5",
		username: "Mom ❤️",
		channel: "whatsapp",
		unread_count: 5,
		last_message: {
			incoming: true,
			timestamp: 1660500000,
			document: { caption: "Dinner is ready.txt" },
		},
	},
	{
		user_id: "6",
		username: "Random Dude",
		channel: "whatsapp",
		last_message: {
			incoming: true,
			timestamp: 1660300000,
			sticker: {},
		},
	},
	{
		user_id: "7",
		username: "Jose Maria Rodriguez",
		channel: "whatsapp",
		last_message: {
			incoming: true,
			timestamp: 1660200000,
			contacts: { name: "Juan Perez" },
		},
	},
	{
		user_id: "8",
		username: "Tommy",
		channel: "whatsapp",
		last_message: {
			incoming: true,
			timestamp: 1660200000,
			location: { name: "This place 🗺️ sucks." },
		},
	},
];

export default function InboxScreenWA({ navigation }) {
	const [messages, setMessages] = useState([]);
	const [unreadTotal, setUnreadTotal] = useState(0);

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

	return (
		<Screen statusBarColor={colors.whatsapp}>
			<InboxHeaderWA navigation={navigation} unread={unreadTotal} />
			<FlatList
				style={styles.container}
				data={messages}
				keyExtractor={(message) => message.user_id}
				renderItem={({ item }) => (
					<>
						{item.channel === "whatsapp" && <CardWA
							{...item}
							onPress={() => navigation.navigate("ChatWhatsApp", { user_id: item.user_id, username: item.username })}
						/>}
					</>
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
		backgroundColor: colors.wa_send_button,
		borderRadius: 28,
		bottom: 15,
		elevation: 5,
		height: 56,
		justifyContent: "center",
		position: "absolute",
		right: 15,
		width: 56,
	},
	container: {
		paddingHorizontal: 15,
	},
	flipX: {
		transform: [{ scaleX: -1 }],
	},
});
