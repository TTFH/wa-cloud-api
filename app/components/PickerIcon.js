import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function PickerIcon({ name, colorTop, colorBottom }) {
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
			<MaterialCommunityIcons style={styles.icon} color="#FFFFFF" name={name} size={40} />
		</View>
	);
}

const styles = StyleSheet.create({
	circle: {
		alignItems: "center",
		borderRadius: 80,
		height: 80,
		justifyContent: "center",
		overflow: "hidden",
		width: 80,
	},
	halfCircle: {
		height: 40,
		width: 80,
	},
	icon: {
		position: "absolute",
	},
});
