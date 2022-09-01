import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PreviewIcon from "../PreviewIcon";

function getMessageText(message) {
	if (message.caption)
		return message.caption;
	if (message.image)
		return "Foto";
	if (message.audio)
		return "Audio";
	if (message.video)
		return "Video";
	if (message.sticker)
		return "Sticker";
	if (message.document)
		return message.document.filename;
	return "Unimplemented message type";
}

function formatTime(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const now = new Date();
	const diff = now - sendDate;

	if (sendDate.getDate() === now.getDate()) {
		const hours = sendDate.getHours();
		const minutes = sendDate.getMinutes();
		return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
	} else if (diff < 48 * 60 * 60 * 1000)
		return "Ayer";

	const year = sendDate.getFullYear() % 100;
	const month = sendDate.getMonth() + 1;
	const day = sendDate.getDate();
	return `${day}/${month}/${year}`;
}

const profilePic = require("../../assets/user_pic.png");

export default function CardWA({ username, unread_count, message, onPress }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.card}>
				<Image style={styles.image} source={profilePic} />
				<View style={styles.textContainer}>
					<View style={styles.flexContainer}>
						<Text style={styles.title} numberOfLines={1}>
							{username}
						</Text>
						<Text style={unread_count > 0 ? styles.unreadDate : styles.date}>
							{formatTime(message.timestamp)}
						</Text>
					</View>

					<View style={styles.flexContainer}>
						<View style={styles.flexContainer}>
							<PreviewIcon render={!message.incoming && message.status === "sent"} name="check" />
							<PreviewIcon render={!message.incoming && message.status === "delivered"} name="check-all" />
							<PreviewIcon render={!message.incoming && message.status === "read"} name="check-all" color="#53BDEB" />

							<PreviewIcon render={message.image} name="image" />
							<PreviewIcon render={message.audio} name="headphones" />
							<PreviewIcon render={message.video} name="video" />
							<PreviewIcon render={message.document} name="text-box" />
							<PreviewIcon render={message.sticker} name="sticker" />
							<PreviewIcon render={message.contacts} name="account" />
							<PreviewIcon render={message.location} name="google-maps" />

							<Text style={styles.subTitle} numberOfLines={1}>
								{getMessageText(message)}
							</Text>
						</View>
						{unread_count > 0 && <Text style={styles.unread} numberOfLines={1}>
							{unread_count}
						</Text>}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		flexDirection: "row",
		margin: 14,
	},
	date: {
		color: "#667781",
		fontSize: 12,
	},
	flexContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 2,
	},
	image: {
		borderRadius: 24,
		height: 48,
		width: 48,
	},
	subTitle: {
		color: "#667781",
		fontSize: 14,
	},
	textContainer: {
		flex: 1,
		marginLeft: 15,
	},
	title: {
		fontSize: 17,
		fontWeight: "bold",
	},
	unread: {
		backgroundColor: "#25D366",
		borderRadius: 10,
		color: "#FFFFFF",
		fontFamily: "sans-serif",
		minWidth: 20,
		padding: 1,
		textAlign: "center",
	},
	unreadDate: {
		color: "#25D366",
		fontSize: 12,
	},
});
