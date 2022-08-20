import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import colors from "../../config/colors";
import PreviewIcon from "../PreviewIcon";

const tail_incoming = require("../../assets/tail_incoming.png");
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

export default function DialogWA({ message, hasTail }) {
	return (
		<View style={[styles.container, !message.incoming ? styles.alignRight : styles.alignLeft]}>
			{hasTail && message.incoming && <Image style={styles.tail} source={tail_incoming} />}
			{!hasTail && message.incoming && <View style={styles.tail} />}

			<View style={[styles.chat,
			message.incoming ? styles.colorFrom : styles.colorTo,
			hasTail && message.incoming && styles.squareCornerFrom,
			hasTail && !message.incoming && styles.squareCornerTo
			]}>
				{message.forwarded &&
					<View style={styles.inline}>
						<Entypo name="forward" color="#8696A0" size={18} />
						<Text style={styles.forward}>
							Reenviado
						</Text>
					</View>
				}
				<View style={styles.chatContent}>
					<Text style={styles.chatText}>
						{getMessageText(message)}
					</Text>
					<Text style={styles.chatTime}>
						{formatTime(message.timestamp)}
					</Text>
					<PreviewIcon render={message.status === "delivered"} name="check-all" />
					<PreviewIcon render={message.status === "read"} name="check-all" color="#53BDEB" />
				</View>
			</View>

			{!message.incoming && hasTail && <Image style={styles.tail} source={tail_outgoing} />}
			{!message.incoming && !hasTail && <View style={styles.tail} />}
		</View>
	);
}

const styles = StyleSheet.create({
	alignLeft: {
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	alignRight: {
		alignItems: "flex-end",
		justifyContent: "flex-end",
	},
	chat: {
		borderRadius: 12,
		marginBottom: 4,
		maxWidth: "75%",
		padding: 5,
	},
	chatContent: {
		alignItems: "flex-end",
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	chatText: {
		fontSize: 16,
		marginBottom: 5,
		marginTop: 0,
		margin: 5,
	},
	chatTime: {
		color: colors.wa_dialog_date,
		fontSize: 13,
		marginHorizontal: 5,
	},
	colorFrom: {
		backgroundColor: colors.white,
	},
	colorTo: {
		backgroundColor: colors.wa_dialog_to,
	},
	container: {
		flex: 1,
		flexDirection: "row",
	},
	forward: {
		color: colors.wa_dialog_date,
		marginBottom: 6,
		paddingLeft: 6,
	},
	inline: {
		flexDirection: "row",
	},
	squareCornerFrom: {
		borderTopLeftRadius: 0,
	},
	squareCornerTo: {
		borderTopRightRadius: 0,
	},
	tail: {
		alignSelf: "flex-start",
		height: 10,
		width: 10
	},
});
