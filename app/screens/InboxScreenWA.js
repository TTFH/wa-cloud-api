import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, Image, View, TouchableOpacity } from "react-native";

import CardWA from "../components/CardWA";
import InboxHeaderWA from "../components/Header/InboxHeaderWA";
import Screen from "../components/Screen";
import colors from "../config/colors";

import { getTotalUnread, getConversations } from "../services/httpservice";

const test_messages = [
	{
		user_id: "-2",
		username: "Test Page",
		profile_pic: require("../assets/test_page.png"),
		channel: "messenger",
		unread_count: 17,
		last_message: {
			from: "59899999999",
			timestamp: 1659646749,
			status: "read",
			text: { body: "Prueba final" },
		},
	},
	{
		user_id: "-1",
		username: "Test Messenger",
		profile_pic: require("../assets/test_profile.png"),
		channel: "messenger",
		unread_count: 0,
		last_message: {
			to: "59899999999",
			timestamp: 1659645749,
			status: "read",
			text: { body: "Hola" },
		},
	},
	{
		user_id: "0",
		username: "Solo tú",
		profile_pic: require("../assets/cat.jpg"),
		channel: "messenger",
		unread_count: 0,
		last_message: {
			to: "59899999999",
			timestamp: 1659644749,
			status: "delivered",
			text: { body: "It's me" },
		},
	},
	{
		user_id: "1",
		username: "Juan Perez",
		channel: "messenger",
		unread_count: 0,
		last_message: {
			to: "59899999999",
			timestamp: 1658791943,
			status: "sent",
			text: { body: "Hola!" },
		},
	},
	{
		user_id: "2",
		username: "Tommy",
		channel: "whatsapp",
		unread_count: 0,
		last_message: {
			from: "59899999999",
			timestamp: 1658591943,
			status: "read",
			image: { caption: "Look at this kitten" },
		},
	},
	{
		user_id: "3",
		username: "Ninja Turbo",
		channel: "whatsapp",
		unread_count: 0,
		last_message: {
			from: "59899999999",
			timestamp: 1658491943,
			status: "delivered",
			video: { caption: "Do you love this song?" },
		},
	},
	{
		user_id: "4",
		username: "Jose Maria Rodriguez",
		channel: "whatsapp",
		unread_count: 0,
		last_message: {
			from: "59899999999",
			timestamp: 1658391943,
			status: "read",
			location: { name: "This place sucks" },
		},
	},
	{
		user_id: "5",
		username: "Test Number",
		channel: "whatsapp",
		unread_count: 0,
		last_message: {
			to: "59899999999",
			timestamp: 1658291943,
			status: "delivered",
			text: { body: "Hello World" },
		},
	},
];

export default function InboxScreenWA({ navigation }) {
	const [messages, setMessages] = useState([]);
	const [unreadTotal, setUnreadTotal] = useState(0);

	useEffect(() => {
		getTotalUnread().then(result => {
			if (result.ok)
				setUnreadTotal(result.data);
		});
		getConversations().then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages(test_messages);
		});
	}, []);

	return (
		<>
			<InboxHeaderWA unread={unreadTotal} />
			<Screen style={styles.screen}>
				<FlatList
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
						<Image style={styles.chatImage}
							source={require("../assets/new_chat.png")}
						/>
					</View>
				</TouchableOpacity>
			</Screen>
		</>
	);
}

const styles = StyleSheet.create({
	screen: {
		padding: 15,
	},
	chatCircle: {
		alignItems: "center",
		backgroundColor: colors.newchat,
		borderRadius: 25,
		bottom: 8,
		height: 50,
		justifyContent: "center",
		position: "fixed",
		right: 8,
		width: 50,
	},
	chatImage: {
		height: 25,
		width: 25,
	},
});
