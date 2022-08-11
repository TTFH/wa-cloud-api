import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View, Image, Text } from "react-native";

import InboxHeaderFB from "../components/Header/InboxHeaderFB";
import Screen from "../components/Screen";
import CardFB from "../components/CardFB";
import colors from "../config/colors";

import { getConversations } from "../services/httpservice";

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
];

export default function InboxScreenFB({ navigation }) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		getConversations().then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages(test_messages);
		});
	}, []);

	return (
		<>
			<InboxHeaderFB />
			<Screen style={styles.screen}>
				<FlatList
					data={messages}
					keyExtractor={(message) => message.user_id}
					renderItem={({ item }) => (
						<>
							{item.channel === "messenger" && <CardFB
								{...item}
								onPress={() => navigation.navigate("ChatMessenger", { user_id: item.user_id, profile_pic: item.profile_pic, username: item.username })}
							/>}
						</>
					)}
				/>

				<View style={styles.flexContainer}>
					<View style={styles.textButton}>
						<Image style={styles.image}
							source={require("../assets/chats.jpg")}
						/>
						<Text style={[styles.title, styles.selectedText]}>
							Chats
						</Text>
					</View>
					<View />
					<View style={styles.textButton}>
						<Image style={styles.image}
							source={require("../assets/persons.jpg")}
						/>
						<Text style={styles.title}>
							Personas
						</Text>
					</View>
				</View>
			</Screen>
		</>
	);
}

const styles = StyleSheet.create({
	textButton: {
		flex: 1,
		alignItems: "center",
	},
	flexContainer: {
		backgroundColor: colors.white,
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		maxHeight: 40,
	},
	screen: {
		padding: 15,
		backgroundColor: colors.white,
	},
	image: {
		height: 30,
		width: 30,
	},
	title: {
		color: "#7A7879",
		fontFamily: "Helvetica",
		fontSize: 16,
		padding: 5,
	},
	selectedText: {
		color: "#0A7CFF",
	},
});
