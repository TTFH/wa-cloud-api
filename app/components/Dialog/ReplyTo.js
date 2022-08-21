import React from "react";
import { StyleSheet, Text, View } from "react-native";

import PreviewIcon from "../PreviewIcon";

export default function ReplyTo({ isSend = false, title, subtitle, hasClose = false }) {
	return (
		<View style={styles.row}>
			<View style={styles.border} />
			<View style={[styles.container, { backgroundColor: isSend ? "#DEF6D4" : "#F5F7F6" }]}>
				<View>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{subtitle}</Text>
				</View>
				<PreviewIcon render={hasClose} name="close" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	border: {
		backgroundColor: "blue",
		borderBottomLeftRadius: 8,
		borderTopLeftRadius: 8,
		width: 5,
	},
	container: {
		borderBottomRightRadius: 8,
		borderTopRightRadius: 8,
		flexDirection: "row",
		flexGrow: 1,
		justifyContent: "space-between",
		padding: 5,
	},
	description: {
		color: "#8696A0",
		fontSize: 14,
	},
	row: {
		flexDirection: "row",
		marginBottom: 5,
	},
	title: {
		color: "blue",
		fontSize: 16,
		paddingBottom: 2,
	},
});
