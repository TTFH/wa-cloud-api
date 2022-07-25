import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Icon({ name, colorTop, colorBottom }) {
	return (
		<View style={styles.circle}>
			<View style={[styles.halfCircle, {
					backgroundColor: colorTop
				}]}
			/>
			<View style={[styles.halfCircle, {
					backgroundColor: colorBottom
				}]}
			/>
			<MaterialCommunityIcons style={styles.icon} color="#fff" name={name} size="40px" />
		</View>
	);
}

const styles = StyleSheet.create({
	icon: {
		position: "fixed",
		backgroundColor: "transparent",
	},
	circle: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 80,
		height: 80,
		width: 80,
		overflow: "hidden",
	},
	halfCircle: {
		height: 40,
		width: 80,
	},
});
