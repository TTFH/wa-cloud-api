import { Video } from "expo-av";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import PreviewIcon from "../PreviewIcon";

function formatTime(ms) {
	if (!ms) return "0:00";
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (60 * 1000)) % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function VideoPlayer({ source }) {
	const [status, setStatus] = useState({});
	return (
		<View>
			<Video
				style={styles.video}
				source={source}
				useNativeControls
				resizeMode="contain"
				onPlaybackStatusUpdate={status => setStatus(status)}
			/>
			<View style={styles.metadata}>
				<PreviewIcon render name="video" color="#FFFF" />
				<Text style={styles.time}>{formatTime(status.durationMillis)}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	metadata: {
		bottom: 2,
		flexDirection: "row",
		left: 2,
		position: "absolute",
	},
	time: {
		color: "#FFFFFF",
		fontSize: 13,
		fontWeight: "bold",
		paddingLeft: 5,
	},
	video: {
		alignSelf: "center",
		borderRadius: 8,
		height: 144,
		width: 256,
	},
});
