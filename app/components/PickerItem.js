import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PickerIcon from "./PickerIcon";

export default function PickerItem({ item, onPress }) {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onPress}>
				<PickerIcon
					colorTop={item.disabled ? "grey" : item.colorTop}
					colorBottom={item.disabled ? "lightgrey" : item.colorBottom}
					name={item.icon}
				/>
			</TouchableOpacity>
			<Text style={styles.label}>{item.label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
		width: "33%",
	},
	label: {
		fontSize: 16,
		marginTop: 5,
		textAlign: "center",
	},
});
