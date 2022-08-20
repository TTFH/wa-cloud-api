import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../config/colors";
import PreviewIcon from "./PreviewIcon";

function truncateText(text, length) {
	if (text.length > length + 3)
		return text.substring(0, length) + "...";
	return text;
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

const profilePic = require("../assets/user_pic.png");

export default function CardWA({
	username,
	unread_count,
	last_message,
	onPress
}) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.card}>
				<Image
					style={styles.image}
					source={profilePic}
				/>
				<View style={styles.textContainer}>
					<View style={styles.flexContainer}>
						<Text style={styles.title} numberOfLines={1}>
							{truncateText(username, 22)}
						</Text>
						{last_message && <Text style={[styles.date, unread_count > 0 && styles.unreadDate]}>
							{formatTime(last_message.timestamp)}
						</Text>}
					</View>

					<View style={styles.flexContainer}>
						{last_message && <View style={styles.card}>
							<PreviewIcon render={!last_message.incoming && last_message.status === "sent"} name="check" />
							<PreviewIcon render={!last_message.incoming && last_message.status === "delivered"} name="check-all" />
							<PreviewIcon render={!last_message.incoming && last_message.status === "read"} name="check-all" color="#53BDEB" />

							<PreviewIcon render={last_message.image} name="image" />
							<PreviewIcon render={last_message.audio} name="microphone" />
							<PreviewIcon render={last_message.video} name="video" />
							<PreviewIcon render={last_message.document} name="text-box" />
							<PreviewIcon render={last_message.sticker} name="sticker" />
							<PreviewIcon render={last_message.contacts} name="account" />
							<PreviewIcon render={last_message.location} name="google-maps" />

							<Text style={styles.subTitle} numberOfLines={1}>
								{truncateText(getMessageText(last_message), last_message.incoming ? 36 : 34)}
							</Text>
						</View>}
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
		flex: 1,
		flexDirection: "row",
	},
	date: {
		color: colors.light,
		fontSize: 12,
	},
	flexContainer: {
		alignItems: "center",
		flex: 1,
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
		color: colors.light,
		fontSize: 14,
		marginLeft: 5,
	},
	textContainer: {
		flex: 1,
		margin: 15,
		marginRight: 0,
	},
	title: {
		fontSize: 17,
		fontWeight: "bold",
	},
	unread: {
		backgroundColor: colors.unread,
		borderRadius: 10,
		color: colors.white,
		fontFamily: "sans-serif",
		minWidth: 20,
		padding: 1,
		textAlign: "center",
	},
	unreadDate: {
		color: colors.unread,
	},
});
