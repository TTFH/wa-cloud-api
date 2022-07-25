import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, Image, View, TouchableOpacity } from "react-native";

import Card from "../components/Card";
import Header from "../components/Header";
import Screen from "../components/Screen";
import colors from "../config/colors";

import { getTotalUnread, getConversations } from "../services/httpservice";

export default function InboxScreen({ navigation }) {
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
				setMessages([]);
		});
	}, []);

	return (
		<>
			<Header unread={unreadTotal} />
			<Screen style={styles.screen}>
				<FlatList
					data={messages}
					keyExtractor={(message) => message.user_id}
					renderItem={({ item }) => (
						<Card
							{...item}
							onPress={() => navigation.navigate("Chat", { user_id: item.user_id, username: item.username })}
						/>
					)}
				/>
				<TouchableOpacity onPress={() => navigation.navigate("AddPhone")}>
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
		padding: 20,
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
