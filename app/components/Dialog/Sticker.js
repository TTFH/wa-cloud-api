import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Sticker({ isSend, source }) {
	return (
		<Image style={[styles.sticker, isSend ? styles.alignRight : styles.alignLeft]} source={source} />
	);
}

const styles = StyleSheet.create({
	alignLeft: {
		alignSelf: "flex-start",
		marginLeft: 10,
	},
	alignRight: {
		alignSelf: "flex-end",
		marginRight: 10,
	},
	sticker: {
		alignSelf: "flex-end",
		height: 120,
		width: 120,
	},
});
