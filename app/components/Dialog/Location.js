import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const location = require("../../assets/location.png");

export default function Location({ source }) {
	return (
		<View style={styles.container}>
			<Image style={styles.image} source={location} />
			<Text style={styles.title}>{source.name}</Text>
			<Text style={styles.subtitle}>{source.address}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		minWidth: "80%",
	},
	image: {
		borderRadius: 12,
		height: 125,
		width: 228,
	},
	subtitle: {
		color: "#8696A0",
		fontSize: 14,
		paddingBottom: 5,
	},
	title: {
		color: "#027EB4",
		fontSize: 18,
		paddingBottom: 2,
	},
});
