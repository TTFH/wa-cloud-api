import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function AppInput({ placeholder, logo, color, onChangeText }) {
	const [text, setText] = useState("");
	return (
		<View style={[styles.button, { borderColor: color }]}>
			<MaterialCommunityIcons color={color} name={logo} size={20} />
			<TextInput style={styles.buttonText} placeholder={placeholder} value={text} onChangeText={text => {
				setText(text);
				onChangeText(text);
			}} />
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		alignSelf: "center",
		borderRadius: 15,
		borderWidth: 1,
		flexDirection: "row",
		margin: 5,
		paddingLeft: 10,
		width: 170,
	},
	buttonText: {
		fontSize: 14,
		padding: 5,
		width: "90%",
	},
});
