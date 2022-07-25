import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function truncateText(text, length) {
	if (text?.length > length + 3)
		return text.substring(0, length) + "...";
	return text;
}

const profilePic = require("../assets/user_pic.png");

export default function ChatHeader({ navigation, username }) {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.flexContainer}>
				<TouchableOpacity onPress={() => navigation.navigate("Home")}>
					<Image style={styles.buttonBack}
						source={require("../assets/back.png")}
					/>
				</TouchableOpacity>
				<Image
					style={styles.image}
					source={profilePic}
				/>
				<Text style={styles.title} numberOfLines={1}>
					{truncateText(username, 22)}
				</Text>
				<Image style={styles.buttonRight}
					source={require("../assets/menu.png")}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonRight: {
		height: 25,
		width: 25,
		marginLeft: "auto",
		marginRight: 12,
	},
	headerContainer: {
		backgroundColor: colors.primary,
	},
	flexContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		minHeight: "auto",
	},
	title: {
		alignSelf: "center",
		color: colors.white,
		fontFamily: "Helvetica",
		fontSize: 16,
	},
	image: {
		borderRadius: 18,
		height: 34,
		width: 34,
		margin: 10,
		marginLeft: 0,
	},
	buttonBack: {
		height: 25,
		width: 25,
		marginLeft: 5,
	},
});
