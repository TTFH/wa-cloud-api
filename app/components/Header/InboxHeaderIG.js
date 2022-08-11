import React from "react";
import { Text, Image, StyleSheet, View, TextInput } from "react-native";

import colors from "../../config/colors";

export default function InboxHeaderIG({ username }) {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.flexContainer}>
				<Image style={styles.button}
					source={require("../../assets/back_ig.png")}
				/>
				<Text style={styles.title} >
					{username}
				</Text>
				<Image style={styles.button}
					source={require("../../assets/change_acc.png")}
				/>
				<Image style={styles.button}
					source={require("../../assets/dots_ig.png")}
				/>
				<Image style={styles.button}
					source={require("../../assets/new_chat_ig.png")}
				/>
			</View>
			<View style={styles.searchBar}>
				<Image style={styles.searchIcon}
					source={require("../../assets/search_ig.png")}
				/>
				<TextInput style={styles.searchInput} placeholderTextColor="#7A7879" placeholder="Buscar" />
				<Image style={styles.searchIcon}
					source={require("../../assets/search_ig.png")}
				/>
			</View>
			<View style={styles.tabs}>
				<Text style={styles.selectedText}>
					Principal
				</Text>
				<Text style={styles.text}>
					General
				</Text>
				<Text style={styles.text}>
					Solicitudes
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		color: "#737373",
		fontSize: 18,
		padding: 25,
	},
	selectedText: {
		color: colors.black,
		fontSize: 18,
		padding: 25,
	},
	tabs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	searchBar: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "#F2F3F5",
		borderRadius: 10,
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
		fontSize: 20,
		fontWeight: "bold",
	},
	button: {
		height: 25,
		marginTop: 0,
		margin: 20,
		width: 25,
	},
	searchIcon: {
		padding: 10,
		marginLeft: 20,
	}
});
