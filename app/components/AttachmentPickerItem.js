import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import Icon from "./Icon";

export default function AttachmentPickerItem({ item, onPress }) {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onPress}>
				<Icon
					colorTop={item.colorTop}
					colorBottom={item.colorBottom}
					name={item.icon}
				/>
			</TouchableOpacity>
			<Text style={styles.label}>{item.label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		alignItems: "center",
		width: "33%",
	},
	label: {
		fontSize: 18,
		marginTop: 5,
		textAlign: "center",
	},
});
