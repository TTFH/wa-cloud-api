import React from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";

import Screen from "../components/Screen";
import AttachmentPickerItem from "../components/AttachmentPickerItem";
import colors from "../config/colors";

const FB_BASE_URL = "https://www.facebook.com/v14.0/dialog/oauth";
const client_id = "";
const scope = "instagram_basic,instagram_manage_messages,pages_manage_metadata,pages_show_list";
const loginUrl = FB_BASE_URL + "?client_id=" + client_id + "&response_type=token&scope=" + scope + "&redirect_uri=https://localhost:19006/";

const channels = [
	{
		colorTop: "#128C7E",
		colorBottom: "#075E54",
		icon: "whatsapp",
		label: "WhatsApp",
		value: 1,
	},
	{
		colorTop: "#00B2FF",
		colorBottom: "#006AFF",
		icon: "facebook-messenger",
		label: "Messenger",
		value: 2,
	},
	{
		colorTop: "#F56040",
		colorBottom: "#E1306C",
		icon: "instagram",
		label: "Instagram",
		value: 3,
	},
];

function goToInbox(navigation, channel) {
	if (channel === "WhatsApp")
		navigation.navigate("WhatsAppInbox");
	else if (channel === "Messenger")
		navigation.navigate("MessengerInbox");
	else if (channel === "Instagram")
		navigation.navigate("InstagramInbox");
}

export default function ChatScreenFB({ navigation }) {
	return (
		<Screen>
			<Text style={styles.text}>
				Home Sweet Home
			</Text>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={() => Linking.openURL(loginUrl)}>
					<Text style={styles.buttonText}>
						Log In with Facebook
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.modal}>
				<FlatList
					data={channels}
					keyExtractor={(item) => item.value.toString()}
					numColumns={3}
					renderItem={({ item }) => (
						<AttachmentPickerItem
							item={item}
							label={item.label}
							onPress={() => {
								goToInbox(navigation, item.label);
							}}
						/>
					)}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		alignItems: "center",
	},
	text: {
		fontSize: 20,
	},
	modal: {
		alignItems: "center",
		alignSelf: "center",
		top: "26%",
		height: "66%",
		justifyContent: "center",
		width: "95%",
		overflow: "hidden",
	},
	button: {
		backgroundColor: "#4267B2",
		borderRadius: 10,
		margin: 10,
	},
	buttonText: {
		color: colors.white,
		fontSize: 15,
		margin: 10,
	},
});
