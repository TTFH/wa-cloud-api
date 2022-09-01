import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import http from "../../services/client";
import AttachmentPicker from "../AttachmentPicker";

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

function sendMessage(user_id, text, setInputText, messages, setMessages) {
	if (text.length > 0) {
		http.post("message", { channel: "whatsapp", user_id, text }).then(result => {
			const message = {
				message_id: result.ok ? result.data : messages.length + 1,
				to: user_id,
				status: "delivered",
				timestamp: Math.floor(Date.now() / 1000),
				caption: text,
			};
			setMessages([...messages, message]);
			setInputText("");
		});
	}
}

export default function InputWA({ navigation, username, user_id, messages, setMessages }) {
	const [text, setText] = useState("");

	function handleAttachment(navigation, label) {
		if (label === "Plantilla")
			navigation.navigate("SendTemplate", { username, user_id });
		else
			console.log(label);
	}

	return (
		<View style={styles.container}>
			<View style={styles.input}>
				{/*<ReplyTo title="+1 (555) 067-2124" subtitle="Esta es una prueba" hasClose />*/}
				<View style={styles.row}>
					<TextInput style={styles.textInput} placeholder="Mensaje" multiline value={text} onChangeText={setText} />
					<AttachmentPicker items={categories} onPress={label => handleAttachment(navigation, label)} />
				</View>
			</View>
			<TouchableOpacity onPress={() => sendMessage(user_id, text, setText, messages, setMessages)} >
				<View style={styles.sendCircle}>
					<MaterialCommunityIcons color="#FFFFFF" name="send" size={25} />
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "flex-end",
		flexDirection: "row",
		padding: 8,
	},
	input: {
		backgroundColor: "#FFFFFF",
		borderRadius: 25,
		elevation: 1,
		flex: 1,
		marginRight: 8,
		padding: 10,
	},
	row: {
		alignItems: "flex-end",
		flexDirection: "row",
	},
	sendCircle: {
		alignItems: "center",
		backgroundColor: "#00A884",
		borderRadius: 22,
		elevation: 3,
		height: 44,
		justifyContent: "center",
		marginBottom: 2,
		width: 44,
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 5,
	},
});
