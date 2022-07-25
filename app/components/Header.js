import React from "react";
import { Text, Image, StyleSheet, View } from "react-native";
import colors from "../config/colors";

export default function Header({ unread }) {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.flexContainer}>
				<Text style={styles.title} >
					WhatsApp Cloud API
				</Text>
				<View style={styles.iconsContainer}>
					<Image style={styles.button}
						source={require("../assets/search.png")}
					/>
					<Image style={styles.button}
						source={require("../assets/menu.png")}
					/>
				</View>
			</View>
			<View style={styles.flexContainer}>
				<Image style={styles.button}
					source={require("../assets/camera.png")}
				/>
				<View style={styles.flexContainer}>
					<View style={styles.selectedTab} >
						<View style={styles.inline}>
							<Text style={styles.selectedTabText}>CHATS</Text>
							{unread > 0 && <Text style={styles.unread}>{unread}</Text>}
						</View>
						<View style={styles.underline}></View>
					</View>
					<Text style={styles.inactiveTab}>ESTADOS</Text>
					<Text style={styles.inactiveTab}>LLAMADAS</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	unread: {
		backgroundColor: colors.white,
		borderRadius: 10,
		color: colors.primary,
		fontFamily: "Helvetica",
		minWidth: 20,
		padding: 1,
		textAlign: "center",
	},
	inline: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		minHeight: "auto",
	},
	headerContainer: {
		backgroundColor: colors.primary,
	},
	flexContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		minHeight: "auto",
	},
	iconsContainer: {
		flexDirection: "row",
	},
	title: {
		color: colors.white,
		fontFamily: "Helvetica",
		fontSize: 20,
		padding: 20,
	},
	selectedTab: {
		flex: 1,
		flexDirection: "column",
	},
	selectedTabText: {
		alignSelf: "center",
		color: colors.white,
		fontFamily: "Helvetica",
		fontSize: 14,
		fontWeight: "bold",
		padding: 10,
	},
	underline: {
		alignSelf: "center",
		backgroundColor: colors.white,
		height: 3,
		width: "90%",
	},
	inactiveTab: {
		color: colors.tab,
		fontFamily: "Helvetica",
		fontSize: 14,
		fontWeight: "bold",
		textAlign: "center",
		padding: 10,
		width: "33%",
	},
	button: {
		height: 25,
		margin: 10,
		width: 25,
	},
});
