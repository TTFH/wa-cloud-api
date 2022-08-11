import React from "react";
import { View, Text, StyleSheet } from "react-native";

import colors from "../../config/colors";

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

export default function DialogToFB({ message, hasTail }) {
	return (
		<View style={styles.container}>
			<View style={styles.container}>
				<View style={[styles.chat, hasTail && styles.squareCorner]}>
					<Text style={styles.chatText}>
						{getMessageText(message)}
					</Text>
				</View>
				<View style={styles.tail} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	squareCorner: {
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
		backgroundColor: "#8B17FE",
		borderRadius: 18,
		maxWidth: "75%",
		marginBottom: 4,
	},
	chatText: {
		color: colors.white,
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
