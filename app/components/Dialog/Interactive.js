import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Interactive({ isSend, source }) {
	return (
		<View style={[styles.container, { alignSelf: isSend ? "flex-end" : "flex-start" }]}>
			{source.call && <View style={[styles.button, { backgroundColor: isSend ? "#E7FFDB" : "#FFFFFF" }]}>
				<MaterialCommunityIcons name="phone" size={20} color="#027EB4" />
				<Text style={styles.buttonText}>
					{source.call}
				</Text>
			</View>}
			{source.web && <View style={[styles.button, { backgroundColor: isSend ? "#E7FFDB" : "#FFFFFF" }]}>
				<MaterialCommunityIcons name="open-in-new" size={20} color="#027EB4" />
				<Text style={styles.buttonText}>
					{source.web}
				</Text>
			</View>}
			{source.list && <View style={[styles.button, { backgroundColor: isSend ? "#E7FFDB" : "#FFFFFF" }]}>
				<MaterialCommunityIcons name="format-list-bulleted" size={20} color="#027EB4" />
				<Text style={styles.buttonText}>
					{source.list}
				</Text>
			</View>}
			{source.buttons?.map((button, index) =>
				<View key={index} style={[styles.button, { backgroundColor: isSend ? "#E7FFDB" : "#FFFFFF" }]}>
					<Text style={styles.buttonText}>
						{button}
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		borderRadius: 12,
		elevation: 1,
		flexDirection: "row",
		justifyContent: "center",
		margin: 2,
	},
	buttonText: {
		color: "#027EB4",
		fontSize: 16,
		fontWeight: "bold",
		margin: 8,
	},
	container: {
		marginBottom: 10,
		paddingHorizontal: 10,
		width: "80%",
	},
});
