import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";

import InboxHeaderIG from "../components/Header/InboxHeaderIG";
import Screen from "../components/Screen";
import CardFB from "../components/CardFB";
import colors from "../config/colors";

import { getConversations, getIgUsername } from "../services/httpservice";

export default function InboxScreenIG({ navigation }) {
	const [messages, setMessages] = useState([]);
	const [username, setUsername] = useState("Loading...");

	useEffect(() => {
		getConversations().then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages([]);
		});
		getIgUsername().then(result => {
			if (result.ok)
				setUsername(result.data);
		});
	}, []);

	return (
		<>
			<InboxHeaderIG username={username} />
			<Screen style={styles.screen}>
				<FlatList
					data={messages}
					keyExtractor={(message) => message.user_id}
					renderItem={({ item }) => (
						<>
							{item.channel === "instagram" && <CardFB
								{...item}
								onPress={() => navigation.navigate("ChatInstagram", { user_id: item.user_id, profile_pic: item.profile_pic, username: item.username })}
							/>}
						</>
					)}
				/>
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
