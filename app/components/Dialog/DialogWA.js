import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import PreviewIcon from "../PreviewIcon";
import ReplyTo from "./ReplyTo";

const tail_incoming = require("../../assets/tail_incoming.png");
const tail_outgoing = require("../../assets/tail_outgoing.png");

function formatTime(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const hours = sendDate.getHours();
	const minutes = sendDate.getMinutes();
	return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

export default function DialogWA({ caption, message, hasTail }) {
	return (
		<View style={[styles.container, !message.incoming ? styles.alignRight : styles.alignLeft]}>
			{hasTail && message.incoming && <Image style={styles.tail} source={tail_incoming} />}
			{!hasTail && message.incoming && <View style={styles.tail} />}

			<View style={[styles.chat,
			message.incoming ? styles.colorFrom : styles.colorTo,
			hasTail && (message.incoming ? styles.squareCornerFrom : styles.squareCornerTo)
			]}>
				{message.forwarded &&
					<View style={styles.inline}>
						<Entypo name="forward" color="#8696A0" size={18} />
						<Text style={styles.forward}>
							Reenviado
						</Text>
					</View>
				}
				{message.reply_to && <ReplyTo isSend={!message.incoming} title={message.reply_to.username} subtitle={message.reply_to.body} />}

				{message.image && <Image style={styles.image} source={message.image.url} />}
				{caption && <Text style={[styles.chatText, message.incoming ? { paddingRight: 40 } : { paddingRight: 60 }]}>
					{caption}
				</Text>}
				<View style={styles.chatContent}>
					<Text style={[styles.chatTime, caption ? { color: "#667781" } : { color: "#FFFFFF" }]}>
						{formatTime(message.timestamp)}
					</Text>
					<PreviewIcon render={message.status === "delivered"} name="check-all" />
					<PreviewIcon render={message.status === "read"} name="check-all" color="#53BDEB" />
				</View>
			</View>

			{!message.incoming && hasTail && <Image style={styles.tail} source={tail_outgoing} />}
			{!message.incoming && !hasTail && <View style={styles.tail} />}
		</View>
	);
}

const styles = StyleSheet.create({
	alignLeft: {
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	alignRight: {
		alignItems: "flex-end",
		justifyContent: "flex-end",
	},
	chat: {
		borderRadius: 12,
		marginBottom: 4,
		maxWidth: "75%",
		padding: 5,
	},
	chatContent: {
		bottom: 7,
		flexDirection: "row",
		position: "absolute",
		right: 7,
	},
	chatText: {
		flexGrow: 1,
		fontSize: 16,
		marginBottom: 5,
		marginTop: 0,
		margin: 5,
		//paddingRight: 60,
	},
	chatTime: {
		fontSize: 13,
		marginHorizontal: 5,
	},
	colorFrom: {
		backgroundColor: "#FFFFFF",
	},
	colorTo: {
		backgroundColor: "#E7FFDB",
	},
	container: {
		flex: 1,
		flexDirection: "row",
	},
	forward: {
		color: "#667781",
		marginBottom: 6,
		paddingLeft: 6,
	},
	image: {
		borderRadius: 8,
		height: 144,
		width: 256,
	},
	inline: {
		flexDirection: "row",
	},
	squareCornerFrom: {
		borderTopLeftRadius: 0,
	},
	squareCornerTo: {
		borderTopRightRadius: 0,
	},
	tail: {
		alignSelf: "flex-start",
		height: 10,
		width: 10
	},
});
