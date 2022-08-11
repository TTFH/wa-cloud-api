import React from "react";
import { Text, Image, StyleSheet, View, TextInput } from "react-native";

import colors from "../../config/colors";

const defaultPic = require("../../assets/user_pic_fb.jpg");
const profile_pic = require("../../assets/test_page.png");

export default function InboxHeaderFB() {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.flexContainer}>
				<Image style={styles.button}
					source={profile_pic || defaultPic}
				/>
				<Text style={styles.title} >
					Chats
				</Text>
				<View style={styles.iconsContainer}>
					<Image style={styles.button}
						source={require("../../assets/filter.jpg")}
					/>
				</View>
			</View>
			<View style={styles.searchBar}>
				<Image style={styles.searchIcon}
					source={require("../../assets/search_fb.png")}
				/>
				<TextInput style={styles.searchInput} placeholderTextColor="#7A7879" placeholder="Buscar" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	searchBar: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "#F2F3F5",
		borderRadius: 20,
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		width: "90%",
	},
	searchInput: {
		padding: 10,
		flex: 1,
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
	iconsContainer: {
		flex: 1,
		alignItems: "flex-end",
	},
	title: {
		color: colors.black,
		fontFamily: "Helvetica",
		fontSize: 24,
		fontWeight: "bold",
	},
	button: {
		borderRadius: 20,
		height: 40,
		marginTop: 0,
		margin: 20,
		width: 40,
	},
	searchIcon: {
		padding: 10,
		marginLeft: 20,
	}
});
