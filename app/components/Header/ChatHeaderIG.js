import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../config/colors";

function truncateText(text, length) {
	if (text?.length > length + 3)
		return text.substring(0, length) + "...";
	return text;
}

const profilePic = require("../../assets/user_pic_fb.jpg");

export default function ChatHeaderIG({ navigation, username, profile_pic }) {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.flexContainer}>
				<TouchableOpacity onPress={() => navigation.navigate("InstagramInbox")}>
					<Image style={styles.buttonBack}
						source={require("../../assets/back_ig.png")}
					/>
				</TouchableOpacity>
				<Image
					style={styles.image}
					source={profile_pic || profilePic}
				/>
				<Text style={styles.title} numberOfLines={1}>
					{truncateText(username, 22)}
				</Text>
				<Image style={styles.buttonRight}
					source={require("../../assets/camera_ig.png")}
				/>
				<Image style={styles.buttonRight}
					source={require("../../assets/info_ig.png")}
				/>
				<Image style={styles.buttonRight}
					source={require("../../assets/info_ig.png")}
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
