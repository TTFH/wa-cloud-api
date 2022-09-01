import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";

import IconButton from "../IconButton";

//<AntDesign name="pdffile1" color="red" size={35} />

export default function Document({ isSend = false, source }) {
	return (
		<>
			<View style={[styles.container, { backgroundColor: isSend ? "#DEF6D4" : "#F5F7F6" }]}>
				<AntDesign name="file1" color="8696A0" size={35} />
				<Text style={styles.caption}>
					{source.filename}
				</Text>
				<IconButton name="download-circle-outline" size={35} onPress={() => Linking.openURL(source.uri)} />
			</View>
			<Text style={styles.time}>
				{Math.floor(source.size / 1024)} KiB · {source.filename.split(".").pop().toUpperCase()}
			</Text>
		</>
	);
}

const styles = StyleSheet.create({
	caption: {
		paddingHorizontal: 5,
	},
	container: {
		alignItems: "center",
		borderRadius: 8,
		flexDirection: "row",
		flexGrow: 1,
		justifyContent: "space-between",
		padding: 5,
	},
	time: {
		color: "#667781",
		fontSize: 13,
		paddingBottom: 2,
		paddingLeft: 5,
	},
});
