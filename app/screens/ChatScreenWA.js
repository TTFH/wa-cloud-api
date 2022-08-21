import React, { useEffect, useRef, useState } from "react";
import { FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";

import DialogWA from "../components/Dialog/DialogWA";
import ChatHeaderWA from "../components/Header/ChatHeaderWA";
import InputWA from "../components/Input/InputWA";
import Screen from "../components/Screen";
import http from "../services/client";

function formatDate(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const now = new Date();
	const diff = now - sendDate;

	if (sendDate.getDate() === now.getDate())
		return "Hoy";
	else if (diff < 48 * 60 * 60 * 1000)
		return "Ayer";

	const year = sendDate.getFullYear();
	const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	const month = monthNames[sendDate.getMonth()];
	const day = sendDate.getDate();
	return `${day} de ${month} de ${year}`;
}

function isSameDay(timestamp1, timestamp2) {
	const date1 = new Date(timestamp1 * 1000);
	const date2 = new Date(timestamp2 * 1000);
	return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

function getMessageText(message) {
	if (message.text)
		return message.text.body;
	if (message.image)
		return message.image.caption;
	if (message.video)
		return message.video.caption;
	if (message.document)
		return message.document.caption;
	if (message.contacts)
		return message.contacts.name;
	if (message.location)
		return message.location.name;
	return "Unimplemented message type";
}

const test_messages = [
	{
		message_id: "1",
		incoming: true,
		timestamp: 1660950000,
		text: {
			body: "Hello!",
		},
	},
	{
		message_id: "2",
		incoming: true,
		timestamp: 1660950100,
		forwarded: true,
		text: {
			body: "Are you a React Native dev?",
		},
	},
	{
		message_id: "3",
		timestamp: 1660950200,
		status: "read",
		reply_to: {
			username: "Juan Perez",
			body: "Are you a React Native dev?",
		},
		text: {
			body: "No",
		},
	},
	{
		message_id: "4",
		timestamp: 1660950300,
		status: "delivered",
		forwarded: true,
		text: {
			body: "I flip bits.",
		},
	},
	{
		message_id: "5",
		incoming: true,
		timestamp: 1660950400,
		reply_to: {
			username: "Tú",
			body: "I flip bits.",
		},
		text: {
			body: "That's fair, hagd",
		},
	},
	{
		message_id: "6",
		incoming: true,
		timestamp: 1660950500,
		status: "read",
		image: {
			caption: "Kitten",
			url: require("../assets/cat1.jpg"),
		},
	},
	{
		message_id: "7",
		timestamp: 1660950600,
		status: "read",
		image: {
			url: require("../assets/cat2.jpg"),
		},
	},
];

export default function ChatScreenWA({ route, navigation }) {
	const { user_id, username } = route.params;
	const [messages, setMessages] = useState([]);
	const scroll = useRef();

	useEffect(() => {
		http.get("messages", { user_id }).then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages(test_messages);
		});
	}, []);

	return (
		<Screen style={styles.background} statusBarColor="#008069">
			<ChatHeaderWA navigation={navigation} username={username} />
			<ImageBackground style={styles.backgroundImage}
				source={require("../assets/background.png")}
			/>
			<View style={styles.chatContainer}>
				<View>
					<FlatList
						ref={scroll}
						onContentSizeChange={() => scroll.current.scrollToEnd()}
						contentContainerStyle={{ justifyContent: "flex-end" }}
						data={messages}
						keyExtractor={(message) => message.message_id}
						renderItem={({ item, index }) => (
							<>
								{(!messages[index - 1] || !isSameDay(messages[index - 1].timestamp, item.timestamp)) &&
									<Text style={styles.date}> {formatDate(item.timestamp)} </Text>}
								<DialogWA caption={getMessageText(item)} message={item} hasTail={!messages[index - 1] || messages[index - 1].incoming !== messages[index].incoming} />
							</>
						)}
					/>
				</View>
			</View>
			<InputWA user_id={user_id} messages={messages} setMessages={setMessages} />
		</Screen>
	);
}

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#EFEAE2",
	},
	backgroundImage: {
		height: "100%",
		opacity: 0.5,
		position: "absolute",
		width: "100%",
		zIndex: -1,
	},
	chatContainer: {
		flex: 1,
		justifyContent: "flex-end",
		paddingHorizontal: 5,
	},
	date: {
		alignSelf: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 7,
		color: "#667781",
		fontSize: 12,
		marginBottom: 8,
		marginTop: 8,
		padding: 5,
	},
});
