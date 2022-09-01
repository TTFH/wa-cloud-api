import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";

export default function Share() {
	return (
		<TouchableHighlight>
			<View style={styles.forward}>
				<Entypo name="forward" color="#FFFFFF" size={25} />
			</View>
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	forward: {
		alignItems: "center",
		backgroundColor: "#8696A0AF",
		borderRadius: 20,
		height: 40,
		justifyContent: "center",
		margin: 10,
		width: 40,
	},
});
