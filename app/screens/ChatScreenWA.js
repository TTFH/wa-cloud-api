import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import AttachmentPicker from "../components/AttachmentPicker";
import DialogWA from "../components/Dialog/DialogWA";
import ChatHeaderWA from "../components/Header/ChatHeaderWA";
import Screen from "../components/Screen";
import colors from "../config/colors";
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
		text: {
			body: "That's fair, hagd",
		},
	},
];

function sendMessage(user_id, text, setInputText, messages, setMessages) {
	if (text.length > 0) {
		http.post("message", { channel: "whatsapp", user_id, text }).then(result => {
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
		http.get("messages", { user_id }).then(result => {
			if (result.ok)
				setMessages(result.data);
			else
				setMessages(test_messages);
		});
	}, []);

	return (
		<Screen style={styles.background} statusBarColor={colors.whatsapp}>
			<ChatHeaderWA navigation={navigation} username={username} />
			<ImageBackground style={styles.backgroundImage}
				source={require("../assets/background.png")}
			/>
			<View style={styles.chatContainer}>
				<View>
					<FlatList
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
			<View style={styles.inputContainer}>
				<AttachmentPicker items={categories} />
				<TextInput style={styles.textInput} placeholder="Mensaje" value={text} onChangeText={setText} />
				<TouchableOpacity onPress={() => sendMessage(user_id, text, setText, messages, setMessages)} >
					<View style={styles.sendCircle}>
						<MaterialCommunityIcons color="#FFFFFF" name="send" size={25} />
					</View>
				</TouchableOpacity>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	background: {
		backgroundColor: colors.wa_chat_bg,
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
		backgroundColor: colors.white,
		borderRadius: 7,
		color: colors.wa_dialog_date,
		fontSize: 12,
		marginBottom: 8,
		marginTop: 8,
		padding: 5,
	},
	inputContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
		paddingBottom: 5,
	},
	sendCircle: {
		alignItems: "center",
		backgroundColor: colors.wa_send_button,
		borderRadius: 22,
		height: 44,
		justifyContent: "center",
		width: 44,
	},
	textInput: {
		backgroundColor: colors.white,
		borderRadius: 25,
		padding: 10,
		width: "75%",
	},
});
