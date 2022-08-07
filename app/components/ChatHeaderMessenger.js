import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function truncateText(text, length) {
	if (text?.length > length + 3)
		return text.substring(0, length) + "...";
	return text;
}

const defaultPic = require("../assets/user_pic_fb.jpg");

export default function ChatHeaderMessenger({ navigation, username, profile_pic }) {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.flexContainer}>
				<TouchableOpacity onPress={() => navigation.navigate("MessengerInbox")}>
					<Image style={styles.buttonBack}
						source={require("../assets/back_fb.png")}
					/>
				</TouchableOpacity>
				<Image
					style={styles.image}
					source={profile_pic || defaultPic}
				/>
				<Text style={styles.title} numberOfLines={1}>
					{truncateText(username, 22)}
				</Text>
				<Image style={styles.buttonRight}
					source={require("../assets/info_fb.png")}
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
		backgroundColor: colors.white,
	},
	flexContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		minHeight: "auto",
	},
	title: {
		alignSelf: "center",
		color: colors.black,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		fontSize: 18,
	},
	image: {
		borderRadius: 18,
		height: 36,
		width: 36,
		margin: 10,
		marginLeft: 0,
	},
	buttonBack: {
		height: 25,
		width: 25,
		marginLeft: 15,
		marginRight: 15,
	},
});
