import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Forward() {
	return (
		<View style={styles.inline}>
			<Entypo name="forward" color="#8696A0" size={18} />
			<Text style={styles.forward}>
				Reenviado
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	forward: {
		color: "#667781",
		marginBottom: 6,
		paddingLeft: 6,
	},
	inline: {
		flexDirection: "row",
	},
});
