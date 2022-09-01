import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

export default function PreviewIcon({ render, name, color = "#8696A0" }) {
	return (
		<>
			{render && <MaterialCommunityIcons style={styles.icon} color={color} name={name} size={18} />}
		</>
	);
}

const styles = StyleSheet.create({
	icon: {
		marginRight: 2,
	},
});
