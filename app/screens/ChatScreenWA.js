import React, { useState, useEffect } from "react";
import { FlatList, View, Text, Image, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from "react-native";

import Screen from "../components/Screen";
import DialogToWA from "../components/Dialog/DialogToWA";
import AttachmentPicker from "../components/AttachmentPicker";
import ChatHeaderWA from "../components/Header/ChatHeaderWA";
import DialogFromWA from "../components/Dialog/DialogFromWA";
import colors from "../config/colors";

import { getMessages, sendTextMessage } from "../services/httpservice";

const send = require("../assets/send.png");

function formatDate(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const now = new Date();
	const diff = now - sendDate;

	if (sendDate.getDate() === now.getDate())
		return "Hoy";
	else if (diff < 48 * 60 * 60 * 1000)
		return "Ayer";

	const year = sendDate.getFullYear();
	const month = sendDate.toLocaleString("es", { month: "long" });
	const day = sendDate.getDate();
	return `${day} de ${month} de ${year}`;
}

function isSameDay(timestamp1, timestamp2) {
	const date1 = new Date(timestamp1 * 1000);
	const date2 = new Date(timestamp2 * 1000);
	return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

const categories = [
	{
		colorTop: "#5157AE",
		colorBottom: "#5F66CD",
		icon: "file-document",
		label: "Documento",
		value: 1,
	},
	{
		colorTop: "#D3396D",
		colorBottom: "#EC407A",
		icon: "video",
		label: "Video",
		value: 2,
	},
	{
		colorTop: "#AC44CF",
		colorBottom: "#BF59CF",
		icon: "image",
		label: "Imagen",
		value: 3,
	},
	{
		colorTop: "#E55E31",
		colorBottom: "#FC6634",
		icon: "music",
		label: "Audio",
		value: 4,
	},
	{
		colorTop: "#1D9B51",
		colorBottom: "#20A856",
		icon: "map",
		label: "Ubicación",
		value: 5,
	},
	{
		colorTop: "#0795DC",
		colorBottom: "#0EABF4",
		icon: "contacts",
		label: "Contacto",
		value: 6,
	},
	{
		colorTop: "#0063CB",
		colorBottom: "#0070E6",
		icon: "sticker",
		label: "Sticker",
		value: 7,
	},
	{
		colorTop: "#FFA800",
		colorBottom: "#FFBC38",
		icon: "gesture-tap-button",
		label: "Interactivo",
		value: 8,
	},
	{
		colorTop: "#5525AC",
		colorBottom: "#673AB7",
		icon: "message-text",
		label: "Plantilla",
		value: 9,
	},
];

const test_messages = [
	{
		message_id: "1",
		to: true,
		status: "read",
		timestamp: 1658310000,
		text: {
			body: "Hola?",
		},
	},
	{
		message_id: "2",
		to: true,
		status: "read",
		timestamp: 1658310100,
		text: {
			body: "Hay alguien?",
		},
	},
	{
		message_id: "3",
		from: true,
		timestamp: 1658310200,
		text: {
			body: "Hello World!",
		},
	},
	{
		message_id: "4",
		from: true,
		timestamp: 1658310300,
		text: {
			body: "Goodbye.",
		},
	},
];

function sendMessage(user_id, text, setInputText, messages, setMessages) {
	if (text.length > 0) {
		sendTextMessage("whatsapp", user_id, text).then(result => {
			const message = {
				message_id: result.ok ? result.data : messages.length + 1,
				to: user_id,
				status: "delivered",
				timestamp: Math.floor(Date.now() / 1000),
				text: {
					body: text,
				},
			};
			setMessages([...messages, message]);
			setInputText("");
		});
	}
}

export default function ChatScreenWA({ route, navigation }) {
	const { user_id, username } = route.params;
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");

	useEffect(() => {
		getMessages(user_id).then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages(test_messages);
		});
	}, []);

	return (
		<Screen style={styles.background}>
			<ChatHeaderWA navigation={navigation} username={username} />
			<ImageBackground style={styles.backgroundImage}
				source={require("../assets/background.png")}
			/>
			<View style={styles.chatContainer}>
				<View >
					<FlatList
						contentContainerStyle={{ justifyContent: "flex-end" }}
						data={messages}
						keyExtractor={(message) => message.message_id}
						renderItem={({ item, index }) => (
							<>
								{(!messages[index - 1] || !isSameDay(messages[index - 1].timestamp, item.timestamp)) &&
									<Text style={styles.date}> {formatDate(item.timestamp)} </Text>
								}
								{item.to && <DialogToWA message={item} hasTail={!messages[index - 1] || !messages[index - 1].to} />}
								{item.from && <DialogFromWA message={item} hasTail={!messages[index - 1] || !messages[index - 1].from} />}
							</>
						)}
					/>
				</View>
				<View style={styles.inputContainer}>
					<AttachmentPicker items={categories} />
					<TextInput style={styles.textInput} placeholder="Mensaje" value={text} onChangeText={setText} />
					<TouchableOpacity onPress={() => sendMessage(user_id, text, setText, messages, setMessages)} >
						<View style={styles.sendCircle}>
							<Image style={styles.button} source={send} />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	date: {
		alignSelf: "center",
		backgroundColor: colors.white,
		color: colors.light,
		fontSize: 12,
		borderRadius: 7,
		padding: 5,
		marginTop: 8,
		marginBottom: 8,
	},
	textInput: {
		borderRadius: 18,
		backgroundColor: colors.white,
		width: "75%",
		padding: 10,
	},
	background: {
		flex: 1,
		overflow: "hidden",
		backgroundColor: colors.background,
	},
	chatContainer: {
		flex: 1,
		justifyContent: "flex-end",
	},
	inputContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 5,
		alignItems: "center",
	},
	backgroundImage: {
		width: "100%",
		height: "100%",
		opacity: 0.5,
		position: "absolute",
		zIndex: -1,
	},
	button: {
		height: 25,
		width: 25,
	},
	sendCircle: {
		backgroundColor: colors.newchat,
		borderRadius: 20,
		height: 40,
		width: 40,
		justifyContent: "center",
		alignItems: "center",
	},
});
