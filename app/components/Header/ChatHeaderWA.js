import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import IconButton from "../IconButton";

function truncateText(text, length) {
	if (text?.length > length + 3)
		return text.substring(0, length) + "...";
	return text;
}

const profilePic = require("../../assets/user_pic.png");

export default function ChatHeaderWA({ navigation, username }) {
	return (
		<View style={styles.container}>
			<IconButton style={styles.backButton} color="#FFFFFF" name="arrow-left" onPress={() => navigation.navigate("WhatsAppInbox")} />
			<Image style={styles.image} source={profilePic} />
			<Text style={styles.title} numberOfLines={1}>
				{truncateText(username, 22)}
			</Text>
			<IconButton style={styles.menuButton} color="#FFFFFF" name="dots-vertical" />
		</View>
	);
}

const styles = StyleSheet.create({
	backButton: {
		paddingLeft: 6,
	},
	container: {
		alignItems: "center",
		backgroundColor: "#008069",
		flexDirection: "row",
	},
	image: {
		borderRadius: 17,
		height: 34,
		margin: 10,
		marginLeft: 2,
		width: 34,
	},
	menuButton: {
		marginLeft: "auto",
		marginRight: 10,
	},
	title: {
		alignSelf: "center",
		color: "#FFFFFF",
		fontFamily: "sans-serif",
		fontSize: 18,
	},
});
