import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AppButton({ text, logo, color, onPress, whiteText }) {
	return (
		<TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
			<MaterialCommunityIcons color={whiteText ? "#FFFFFF" : "#000000"} name={logo} size={20} />
			<Text style={[styles.buttonText, { color: whiteText ? "#FFFFFF" : "#000000" }]}>
				{text}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		alignSelf: "center",
		borderRadius: 15,
		flexDirection: "row",
		margin: 5,
		paddingLeft: 10,
		width: 170,
	},
	buttonText: {
		fontSize: 14,
		margin: 10,
	},
});
