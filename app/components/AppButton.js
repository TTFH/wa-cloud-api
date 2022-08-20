import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

export default function AppButton({ text, logo, color, onPress }) {
	return (
		<TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
			<MaterialCommunityIcons color="#FFFFFF" name={logo} size={20} />
			<Text style={styles.buttonText}>
				{text}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		alignSelf: "center",
		borderRadius: 20,
		flexDirection: "row",
		justifyContent: "center",
		margin: 10,
		width: 185,
	},
	buttonText: {
		color: colors.white,
		fontSize: 14,
		margin: 10,
	},
});
