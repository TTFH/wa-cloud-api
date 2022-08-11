import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../config/colors";
import { markAsRead } from "../../services/httpservice";

const tail_incoming = require("../../assets/tail_incoming.png");

function formatTime(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const hours = sendDate.getHours();
	const minutes = sendDate.getMinutes();
	return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

function selectMessage(message_id) {
	markAsRead(message_id);
}

export default function DialogFromWA({ message, hasTail }) {
	return (
		<View style={styles.container}>
			<View style={styles.container}>
				{!hasTail && <View style={styles.tail} />}
				{hasTail && <Image style={styles.tail} source={tail_incoming} />}
				<TouchableOpacity style={[styles.chat, hasTail && styles.squareCorner]}
					onPress={() => selectMessage(message.message_id)}
				>
					<Text style={styles.chatText}>
						{message.text?.body}
					</Text>
					<Text style={styles.chatTime}>
						{formatTime(message.timestamp)}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	squareCorner: {
		borderTopLeftRadius: 0,
	},
	tail: {
		width: 10,
		height: 10,
		alignSelf: "flex-start"
	},
	container: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	chat: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-start",
		backgroundColor: "#ffff",
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
		paddingRight: 10,
	},
	chatStatus: {
		height: 18,
		width: 18,
		margin: 5,
		marginLeft: 8,
	},
});
