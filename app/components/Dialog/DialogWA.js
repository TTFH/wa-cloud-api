import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import PreviewIcon from "../PreviewIcon";
import AudioPlayer from "./AudioPlayer";
import Contact from "./Contact";
import Document from "./Document";
import Forward from "./Forward";
import ImagePreview from "./ImagePreview";
import Interactive from "./Interactive";
import Location from "./Location";
//import Markdown from "./Markdown";
import ReplyTo from "./ReplyTo";
import Sticker from "./Sticker";
import VideoPlayer from "./VideoPlayer";

const tail_incoming = require("../../assets/tail_incoming.png");
const tail_outgoing = require("../../assets/tail_outgoing.png");

function formatTime(timestamp) {
	const sendDate = new Date(timestamp * 1000);
	const hours = sendDate.getHours();
	const minutes = sendDate.getMinutes();
	return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

export default function DialogWA({ message, hasTail }) {
	if (!message) return null;
	if (message.template) {
		const caption = "Hello {{1}}, this is a test message with a button. For some reason Spanish was not available.";
		const buttons = ["Clickeame!"];
		message.caption = caption.replace("{{1}}", message.template.vars[0]);
		message.interactive = { buttons };
	}
	hasTail = hasTail && !message.sticker;

	return (
		<>
			{message.sticker && <Sticker isSend={!message.incoming} source={message.sticker} />}
			<View style={[styles.container, !message.incoming ? styles.alignRight : styles.alignLeft]}>
				{hasTail && message.incoming && <Image style={styles.tail} source={tail_incoming} />}
				{!hasTail && message.incoming && <View style={styles.tail} />}

				<View style={[styles.chat,
				message.incoming ? styles.colorFrom : styles.colorTo,
				hasTail && (message.incoming ? styles.squareCornerFrom : styles.squareCornerTo),
				message.sticker && styles.stickerMargin,
				]}>
					{message.forwarded && <Forward />}
					{message.reply_to && <ReplyTo isSend={!message.incoming} title={message.reply_to.username} subtitle={message.reply_to.body} />}

					{message.image && <ImagePreview source={message.image} />}
					{message.audio && <AudioPlayer source={message.audio} />}
					{message.video && <VideoPlayer source={message.video} />}
					{message.document && <Document isSend={!message.incoming} source={message.document} />}

					{message.contacts && <Contact source={message.contacts} />}
					{message.location && <Location source={message.location} />}

					{message.caption && <Text style={[styles.chatText, message.incoming ? { paddingRight: 40 } : { paddingRight: 60 }]}>
						{message.caption}
					</Text>}

					<View style={styles.chatContent}>
						<Text style={[styles.chatTime, !message.caption && (message.image || message.video) ? { color: "#FFFFFF" } : { color: "#667781" }]}>
							{formatTime(message.timestamp)}
						</Text>
						<PreviewIcon render={!message.incoming && message.status === "sent"} name="check" />
						<PreviewIcon render={!message.incoming && message.status === "delivered"} name="check-all" />
						<PreviewIcon render={!message.incoming && message.status === "read"} name="check-all" color="#53BDEB" />
					</View>
				</View>

				{hasTail && !message.incoming && <Image style={styles.tail} source={tail_outgoing} />}
				{!hasTail && !message.incoming && <View style={styles.tail} />}
			</View>
			{message.interactive && <Interactive isSend={!message.incoming} source={message.interactive} />}
		</>
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
		maxWidth: "82%",
		minHeight: 30,
		padding: 5,
	},
	chatContent: {
		alignSelf: "flex-end",
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
	},
	chatTime: {
		fontSize: 13,
		marginHorizontal: 5,
	},
	colorFrom: {
		backgroundColor: "#FFFFFF",
		minWidth: 55,
	},
	colorTo: {
		backgroundColor: "#E7FFDB",
		minWidth: 75,
	},
	container: {
		flexDirection: "row",
	},
	squareCornerFrom: {
		borderTopLeftRadius: 0,
	},
	squareCornerTo: {
		borderTopRightRadius: 0,
	},
	stickerMargin: {
		marginLeft: 66,
	},
	tail: {
		alignSelf: "flex-start",
		height: 10,
		width: 10
	},
});
