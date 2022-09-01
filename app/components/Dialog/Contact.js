import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const profilePic = require("../../assets/user_pic.png");

export default function Contact({ source }) {
	return (
		<View style={styles.container}>
			<Image style={styles.image} source={profilePic} />
			<Text style={styles.text}>{source.name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flexDirection: "row",
		marginBottom: 10,
		minWidth: "80%",
	},
	image: {
		borderRadius: 24,
		height: 48,
		width: 48,
	},
	text: {
		color: "#027EB4",
		fontSize: 16,
		fontWeight: "bold",
		padding: 10,
	},
});
