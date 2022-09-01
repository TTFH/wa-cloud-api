import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, ImageBackground, StyleSheet, Text, TouchableHighlight, View } from "react-native";

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

const test_messages = [
	{
		message_id: "1",
		incoming: true,
		timestamp: 1660950000,
		caption: "Hello!",
	},
	{
		message_id: "2",
		incoming: true,
		timestamp: 1660950100,
		forwarded: true,
		caption: "Are you a React Native dev?",
	},
	{
		message_id: "3",
		timestamp: 1660950200,
		status: "read",
		reply_to: {
			username: "Juan Perez",
			body: "Are you a React Native dev?",
		},
		caption: "No",
	},
	{
		message_id: "4",
		timestamp: 1660950300,
		status: "delivered",
		forwarded: true,
		caption: "I flip bits.",
	},
	{
		message_id: "5",
		incoming: true,
		timestamp: 1660950400,
		reply_to: {
			username: "Tú",
			body: "I flip bits.",
		},
		caption: "That's fair, hagd",
	},
	{
		message_id: "6",
		timestamp: 1660950500,
		status: "read",
		image: require("../assets/cat.jpg"),
	},
	{
		message_id: "7",
		incoming: true,
		timestamp: 1660950600,
		status: "read",
		caption: "_Some *cats* under a solar eclipse_ *cool,* right?",
		image: require("../assets/cat.jpg"),
	},
	{
		message_id: "8",
		timestamp: 1660950700,
		status: "read",
		audio: require("../assets/rage_your_dream.mp3"),
	},
	{
		message_id: "9",
		timestamp: 1660950800,
		incoming: true,
		audio: require("../assets/rage_your_dream.mp3"),
	},
	{
		message_id: "10",
		timestamp: 1660950900,
		status: "read",
		caption: "Not a cat",
		video: require("../assets/mechi.mp4"),
	},
	{
		message_id: "11",
		timestamp: 1660951000,
		incoming: true,
		video: require("../assets/mechi.mp4"),
	},
	{
		message_id: "12",
		timestamp: 1660951100,
		status: "read",
		caption: "1",
	},
	{
		message_id: "13",
		timestamp: 1660951200,
		incoming: true,
		caption: "2",
	},
	{
		message_id: "14",
		timestamp: 1660951300,
		status: "read",
		document: {
			filename: "test_document.pdf",
			size: 49152,
			uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		},
	},
	{
		message_id: "15",
		timestamp: 1660951400,
		incoming: true,
		document: {
			filename: "example_test_file.pdf",
			size: 123456,
			uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		},
	},
	{
		message_id: "16",
		timestamp: 1660951500,
		status: "read",
		sticker: require("../assets/this_is_fine.webp"),
	},
	{
		message_id: "17",
		timestamp: 1660951600,
		incoming: true,
		sticker: require("../assets/this_is_fine.webp"),
	},
	{
		message_id: "18",
		timestamp: 1660951700,
		status: "read",
		contacts: { name: "Juan Perez" },
	},
	{
		message_id: "19",
		timestamp: 1660951800,
		incoming: true,
		contacts: { name: "Juan Perez" },
	},
	{
		message_id: "20",
		timestamp: 1660951900,
		status: "read",
		location: { name: "Antel Arena", address: "Airstrike target" },
	},
	{
		message_id: "21",
		timestamp: 1660952000,
		incoming: true,
		location: { name: "Antel Arena", address: "Airstrike target" },
	},
	{
		message_id: "22",
		timestamp: 1660952100,
		status: "read",
		caption: "normal _italic_ *bold* ~strikethrough~ ```monospace``` http://example.com/",
	},
	{
		message_id: "23",
		timestamp: 1660952200,
		incoming: true,
		caption: "Hello {{1}} this is a test message.",
		interactive: { var1: "Juan", call: "Llamar", web: "Visitar web", list: "Configurar" },
	},
	{
		message_id: "24",
		timestamp: 1660952300,
		incoming: true,
		caption: "Meeting!",
		interactive: { buttons: ["Ok", "Sleep"] },
	},
	{
		message_id: "25",
		timestamp: 1660952400,
		status: "read",
		template: { vars: ["<username>"] },
	},
	{
		message_id: "26",
		status: "delivered",
		timestamp: 1660952500,
		caption: "123456789012345678901234567890",
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

	Notifications.addNotificationReceivedListener(notification => {
		const notificationData = notification.request.content.data;
		if (notificationData.user_id === user_id)
			setMessages([...messages, notificationData.message]);
	});

	return (
		<Screen style={styles.background} statusBarColor="#008069">
			<ChatHeaderWA navigation={navigation} username={username} />
			<ImageBackground style={styles.backgroundImage}
				source={require("../assets/background.png")}
			/>
			<View style={styles.chatContainer}>
				<View style={styles.scroll}>
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
								<DialogWA message={item} hasTail={!messages[index - 1] || messages[index - 1].incoming !== messages[index].incoming} />
							</>
						)}
					/>
				</View>
			</View>

			<TouchableHighlight onPress={() => scroll.current.scrollToEnd()}>
				<View style={styles.scrollDown}>
					<MaterialCommunityIcons color="#8696A0" name="chevron-double-down" size={25} />
				</View>
			</TouchableHighlight>

			<InputWA navigation={navigation} user_id={user_id} username={username} messages={messages} setMessages={setMessages} />
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
	scroll: {
		maxHeight: "100%",
		overflow: "scroll",
	},
	scrollDown: {
		alignItems: "center",
		backgroundColor: "#FFFFFFAF",
		borderRadius: 16,
		bottom: 5,
		elevation: 1,
		height: 32,
		justifyContent: "center",
		position: "absolute",
		right: 15,
		width: 32,
	},
});
