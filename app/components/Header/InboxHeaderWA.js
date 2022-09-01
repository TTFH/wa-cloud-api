import React from "react";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "../IconButton";

export default function InboxHeaderWA({ unread }) {
	return (
		<View style={styles.shadow}>
			<View style={styles.flexContainer}>
				<Text style={styles.title} >
					WhatsApp Cloud API
				</Text>
				<View style={styles.iconsContainer}>
					<IconButton style={styles.button} color="#FFFFFF" name="magnify" />
					<IconButton style={styles.button} color="#FFFFFF" name="dots-vertical" />
				</View>
			</View>
			<View style={styles.flexContainer}>
				<IconButton style={styles.button} color="#B4D9D2" name="camera" />
				<View style={styles.selectedTab} >
					<View style={styles.inline}>
						<Text style={styles.selectedTabText}>CHATS</Text>
						{unread > 0 && <Text style={styles.unread}>{unread}</Text>}
					</View>
					<View style={styles.underline} />
				</View>
				<Text style={styles.inactiveTab}>ESTADOS</Text>
				<Text style={styles.inactiveTab}>LLAMADAS</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		margin: 8,
	},
	flexContainer: {
		alignItems: "center",
		backgroundColor: "#008069",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 2,
	},
	iconsContainer: {
		flexDirection: "row",
	},
	inactiveTab: {
		color: "#B4D9D2",
		fontFamily: "Roboto",
		fontSize: 14,
		fontWeight: "bold",
		padding: 12,
		paddingBottom: 15,
		textAlign: "center",
		width: "30%",
	},
	inline: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		minHeight: "auto",
	},
	selectedTab: {
		alignItems: "center",
		flexDirection: "column",
		width: "30%",
	},
	selectedTabText: {
		color: "#FFFFFF",
		fontFamily: "Roboto",
		fontSize: 14,
		fontWeight: "bold",
	},
	shadow: {
		backgroundColor: "#008069",
		elevation: 5,
	},
	title: {
		color: "#FFFFFF",
		fontFamily: "Roboto",
		fontSize: 20,
		padding: 14,
	},
	underline: {
		alignSelf: "center",
		backgroundColor: "#FFFFFF",
		height: 3,
		width: "100%",
	},
	unread: {
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		color: "#008069",
		fontFamily: "Roboto",
		fontSize: 12,
		minWidth: 20,
		padding: 1,
		textAlign: "center",
		marginLeft: 8,
	},
});
