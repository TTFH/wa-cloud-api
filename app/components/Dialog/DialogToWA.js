import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import colors from "../../config/colors";

const delivered = require("../../assets/delivered.png");
const read = require("../../assets/read.png");
const tail_outgoing = require("../../assets/tail_outgoing.png");

function formatTime(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const hours = sendDate.getHours();
	const minutes = sendDate.getMinutes();
	return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

function getMessageText(message) {
	if (message.text)
		return message.text.body;
	if (message.image)
		return message.image.caption || "Foto";
	if (message.audio)
		return "Audio";
	if (message.video)
		return message.video.caption || "Video";
	if (message.document)
		return message.document.caption;
	if (message.sticker)
		return "Sticker";
	if (message.contacts)
		return message.contacts.name;
	if (message.location)
		return message.location.name;
	return "Unimplemented message type";
}

export default function DialogToWA({ message, hasTail }) {
	return (
		<View style={styles.container}>
			<View style={styles.container}>
				<View style={[styles.chat, hasTail && styles.squareCorner]}>
					<Text style={styles.chatText}>
						{getMessageText(message)}
					</Text>
					<Text style={styles.chatTime}>
						{formatTime(message.timestamp)}
					</Text>
					{message.status === "delivered" && <Image style={styles.chatStatus} source={delivered} />}
					{message.status === "read" && <Image style={styles.chatStatus} source={read} />}
				</View>
				{hasTail && <Image style={styles.tail} source={tail_outgoing} />}
				{!hasTail && <View style={styles.tail} />}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	squareCorner: {
		borderTopRightRadius: 0,
	},
	tail: {
		width: 10,
		height: 10,
		alignSelf: "flex-start"
	},
	container: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
	},
	chat: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		backgroundColor: colors.sendbuble,
		borderRadius: 10,
		maxWidth: "75%",
		marginBottom: 4,
	},
	chatText: {
		marginTop: 5,
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 10,
		fontSize: 16,
	},
	chatTime: {
		color: colors.light,
		fontSize: 14,
		paddingBottom: 5,
	},
	chatStatus: {
		height: 18,
		width: 18,
		margin: 5,
		marginRight: 8,
	},
});
