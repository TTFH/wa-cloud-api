import React from "react";
import { Text, Image, StyleSheet, View, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function truncateText(text, length) {
	if (text.length > length + 3)
		return text.substring(0, length) + "...";
	return text;
}

function getMessageText(message) {
	if (message.text)
		return (message.to ? "Tú: " : "") + message.text.body;
	return "Unimplemented message type";
}

// TODO: implement
function formatTime(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const now = new Date();
	const diff = now - sendDate;

	//if (sendDate.getDate() === now.getDate()) {
	const hours = sendDate.getHours();
	const minutes = sendDate.getMinutes();
	return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
	/*} else if (diff < 48 * 60 * 60 * 1000)
		return "Ayer";

	const year = sendDate.getFullYear();
	const month = sendDate.getMonth();
	const day = sendDate.getDate();
	return `${day}/${month}/${year}`;*/
}

const delivered = require("../assets/delivered_fb.png");

const image = require("../assets/image.png");
const audio = require("../assets/audio.png");
const video = require("../assets/video.png");
const document = require("../assets/document.png");
const sticker = require("../assets/sticker.png");
const contacts = require("../assets/contacts.png");
const location = require("../assets/location.png");

const profilePic = require("../assets/user_pic_fb.jpg");

export default function CardFB({
	username,
	profile_pic,
	unread_count,
	last_message,
	onPress
}) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.card}>
				<Image
					style={styles.image}
					source={profile_pic || profilePic}
				/>
				<View style={styles.textContainer}>
					<View style={styles.flexContainer}>
						<Text style={[styles.title, unread_count > 0 && styles.unread]} numberOfLines={1}>
							{truncateText(username, 22)}
						</Text>
					</View>

					{last_message.to && last_message.status === "delivered" && <Image source={delivered} style={styles.icon} />}
					{last_message.to && last_message.status === "read" && <Image source={profile_pic || profilePic} style={styles.icon} />}

					<View style={styles.flexContainer}>
						{last_message && <View style={styles.card}>
							{last_message.image && <Image source={image} style={styles.icon} />}
							{last_message.audio && <Image source={audio} style={styles.icon} />}
							{last_message.video && <Image source={video} style={styles.icon} />}
							{last_message.document && <Image source={document} style={styles.icon} />}
							{last_message.sticker && <Image source={sticker} style={styles.icon} />}
							{last_message.contacts && <Image source={contacts} style={styles.icon} />}
							{last_message.location && <Image source={location} style={styles.icon} />}
							<Text style={[styles.subTitle, unread_count > 0 && styles.unread]} numberOfLines={1}>
								{truncateText(getMessageText(last_message), last_message.to ? 34 : 36)}
							</Text>
							{last_message && <Text style={[styles.date, unread_count > 0 && styles.unread]}>
								{" · " + formatTime(last_message.timestamp)}
							</Text>}
						</View>}
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
	textContainer: {
		flex: 1,
		margin: 15,
		marginRight: 5,
	},
	flexContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	image: {
		borderRadius: 25,
		height: 50,
		width: 50,
	},
	title: {
		color: colors.strong,
		fontSize: 17,
	},
	subTitle: {
		color: colors.light,
		fontSize: 14,
	},
	icon: {
		alignSelf: "flex-end",
		position: "absolute",
		top: 12,
		height: 18,
		borderRadius: 9,
		marginRight: 5,
		width: 18,
	},
	date: {
		color: colors.light,
		fontSize: 12,
	},
	unreadDate: {
		fontWeight: "bold",
	},
	unread: {
		fontWeight: "bold",
		/*backgroundColor: colors.unread,
		borderRadius: 10,
		color: colors.white,
		fontFamily: "Helvetica",
		minWidth: 20,
		padding: 1,
		textAlign: "center",*/
	},
});
