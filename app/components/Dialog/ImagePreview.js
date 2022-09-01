import React from "react";
import { Image, StyleSheet } from "react-native";

export default function ImagePreview({ source }) {
	return (
		<Image style={styles.image} source={source} />
	);
}

const styles = StyleSheet.create({
	image: {
		alignSelf: "center",
		borderRadius: 8,
		height: 144,
		width: 256,
	},
});
