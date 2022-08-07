const fs = require("fs");
const express = require("express");
const http = require("axios").default;
const body_parser = require("body-parser");
const app = express().use(body_parser.json());

const PORT = 3000;
const FB_BASE_URL = "https://graph.facebook.com/v14.0/";
const VERIFY_TOKEN = "14980c8b8a96fd9e279796a61cf82c9c";

const PHONE_NUMBER_ID = "";
const WHATSAPP_TOKEN = "";

const PAGE_ID = "";
const MESSENGER_TOKEN = "";

function initDatabase() {
	const db_filename = "./database.json";
	global.database = { "users": {}, "messages": {}, "media": {} };

	if (fs.existsSync(db_filename)) {
		const rawdata = fs.readFileSync(db_filename);
		database = JSON.parse(rawdata);
	}

	database.update = () => {
		const data = JSON.stringify(database);
		fs.writeFileSync(db_filename, data);
	};
}

function serverUp() {
	console.log("Webhook is listening!");
}

function verifyEndpoint(req, res) {
	if (req.query["hub.mode"] === "subscribe" &&
		req.query["hub.verify_token"] === VERIFY_TOKEN) {
		console.log("Webhook verified!");
		res.status(200).send(req.query["hub.challenge"]);
	} else {
		console.error("Failed validation. Validation tokens do not match.");
		res.sendStatus(403);
	}
}

function receiveWhatsApp(req, res) {
	const value = req.body.entry[0].changes[0].value;
	if (value.statuses) {
		const message_id = value.statuses[0].id;
		const status = value.statuses[0].status;

		if (database.messages[message_id])
			database.messages[message_id].status = status;
	} else if (value.messages) {
		const message = value.messages[0];
		const from = message.from;
		const username = value.contacts[0].profile.name;
		database.users[from] = { channel: "whatsapp", name: username };

		const message_id = message.id;
		database.messages[message_id] = {
			from,
			timestamp: message.timestamp,
			status: "delivered",
		};

		if (message.context)
			console.log("Received reply-to message " + message.context.id);
		if (message.referral)
			console.log("Received referral: " + message.referral.body);

		if (message.type === "text") {
			const msg_body = message.text.body;
			database.messages[message_id].text = { body: msg_body };
		} else if (message.type === "image") {
			const image_id = message.image.id;
			const caption = message.image.caption;
			downloadMedia(image_id);
			database.messages[message_id].image = { caption, media_id: image_id };
		} else if (message.type === "audio") {
			const audio_id = message.audio.id;
			downloadMedia(audio_id);
			database.messages[message_id].audio = { media_id: audio_id };
		} else if (message.type === "video") {
			const video_id = message.video.id;
			const caption = message.video.caption;
			downloadMedia(video_id);
			database.messages[message_id].video = { caption, media_id: video_id };
		} else if (message.type === "document") {
			const caption = message.document.caption;
			const document_id = message.document.id;
			downloadMedia(document_id);
			database.messages[message_id].document = { caption, media_id: document_id };
		} else if (message.type === "sticker") {
			const sticker_id = message.sticker.id;
			downloadMedia(sticker_id);
			database.messages[message_id].sticker = { media_id: sticker_id };
		} else if (message.type === "button") {
			const text = message.button.text;
			//const payload = message.button.payload;
			database.messages[message_id].button = { text };
		} else if (message.type === "interactive") {
			if (message.interactive.type === "button_reply") {
				//const id = message.interactive.button_reply.id;
				const title = message.interactive.button_reply.title;
				database.messages[message_id].interactive = { text: title };
			} else {
				console.log("Unkown interactive type: " + message.interactive.type);
			}
		} else if (message.type === "contacts") {
			const name = message.contacts[0].name.formatted_name;
			const phone = message.contacts[0].phones[0].phone;
			database.messages[message_id].contacts = { name, phone };
		} else if (message.type === "location") {
			const name = message.location.name;
			const address = message.location.address;
			database.messages[message_id].location = { name, address };
		} else if (message.type === "unsupported") { // Interactive msg fordwarded
			const details = message.errors[0].details;
			database.messages[message_id].unsupported = { text: details };
		} else {
			console.log("Unkown message type: " + message.type);
		}
	}

	database.update();
	res.sendStatus(200);
}

function receiveMessenger(req, res) {
	req.body.entry.forEach(entry => {
		const user_id = entry.messaging[0].sender.id;

		if (entry.messaging[0].delivery) {
			console.log("Delivered notification received.");
			return;
		}

		if (entry.messaging[0].read) {
			const readed_time = entry.messaging[0].read.watermark;
			Object.values(database.messages).forEach(message => {
				if (message.to === user_id && message.timestamp <= readed_time) {
					message.status = "read";
					console.log("Message readed.");
				}
			});
			return;
		}

		if (entry.messaging[0].message.is_echo) {
			console.log("Received message from myself.");
			/*const message_id = entry.messaging[0].message.mid;
			database.messages[message_id] = {
				to: entry.messaging[0].recipient.id,
				timestamp: Math.floor(Date.now() / 1000),
				status: "sent",
				text: { body: entry.messaging[0].message.text },
			};*/
			return;
		}

		http.get(FB_BASE_URL + user_id + "?access_token=" + MESSENGER_TOKEN, {
		}).then(response => {
			if (response.data.id) {
				const username = response.data.first_name + " " + response.data.last_name;
				// TODO: add profile picture
				database.users[user_id] = { channel: "messenger", name: username, profile_pic: response.data.profile_pic };
				database.update(); // Needed cause async
			}
		});

		const message_id = entry.messaging[0].message.mid;
		const timestamp = entry.messaging[0].timestamp; // TODO: Seconds or ms???
		database.messages[message_id] = {
			from: user_id,
			timestamp,
			status: "delivered",
		};

		// TODO: handle attachments
		database.messages[message_id].text = { body: entry.messaging[0].message.text };
	});
	database.update();
	res.sendStatus(200);
}

function receiveInstagram(req, res) {
	console.log("Received Notification: " + JSON.stringify(req.body));
	res.sendStatus(200);
}

function getTotalUnread(req, res) {
	// TODO: WhatsApp only?
	const total = Object.values(database.messages).filter(m => m.from && m.status !== "read").length;
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(total.toString());
}

function getConversations(req, res) {
	var conversations = [];
	for (const user_id in database.users) {
		const user = database.users[user_id];
		const unread_count = Object.values(database.messages).filter(m => m.from === user_id && m.status !== "read").length;
		const last_message = Object.values(database.messages).filter(m => m.from === user_id || m.to === user_id).sort((a, b) => b.timestamp - a.timestamp)[0];
		conversations.push({ user_id, username: user.name, channel: user.channel, profile_pic: user.profile_pic, unread_count, last_message });
	}
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(conversations);
}

function getMessages(req, res) {
	const user_id = req.query["user_id"];
	var messages = [];
	for (const message_id in database.messages) {
		var m = database.messages[message_id];
		m.message_id = message_id;
		if (m.from === user_id || m.to === user_id)
			messages.push(m);
	}
	messages.sort((a, b) => a.timestamp - b.timestamp);
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(messages);
}

function sendText(phone_number, text_msg) {
	return new Promise((resolve, reject) => {
		http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
			{
				messaging_product: "whatsapp",
				to: phone_number,
				text: { body: text_msg },
			}, {
			headers: {
				"Content-Type": "application/json",
			}
		}).then(response => {
			if (response.data.messages) {
				const message_id = response.data.messages[0].id;
				database.messages[message_id] = {
					to: phone_number,
					timestamp: Math.floor(Date.now() / 1000),
					status: "sent",
					text: { body: text_msg },
				};
				database.update();
				resolve(message_id);
			}
		}).catch(error => {
			reject(error);
		});
	});
}

function sendTextMessenger(user_id, text_msg) {
	return new Promise((resolve, reject) => {
		http.post(FB_BASE_URL + "me/messages" + "?access_token=" + MESSENGER_TOKEN,
			{
				recipient: { id: user_id },
				message: { text: text_msg }
			}, {
			headers: {
				"Content-Type": "application/json",
			}
		}).then(response => {
			if (response.data.message_id) {
				const message_id = response.data.message_id;
				database.messages[message_id] = {
					to: user_id,
					timestamp: Math.floor(Date.now() / 1000),
					status: "sent",
					text: { body: text_msg },
				};
				database.update();
				resolve(message_id);
			} else
				reject(error);
		}).catch(error => {
			reject(error);
		});
	});
}

function sendMessage(req, res) {
	const channel = req.body.channel;
	const user_id = req.body.user_id;
	const message_text = req.body.text;
	//res.setHeader("Access-Control-Allow-Origin", "*");
	console.log("Sending message to " + channel + ": " + message_text);

	if (channel === "whatsapp") {
		sendText(user_id, message_text).then(message_id => {
			res.send(message_id);
		}).catch(error => {
			res.sendStatus(error.response.status);
		});
	} else if (channel === "messenger") {
		console.log("Sending message");
		sendTextMessenger(user_id, message_text).then(message_id => {
			console.log("Message send");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.send(message_id);
		}).catch(error => {
			res.setHeader("Access-Control-Allow-Origin", "*");
			console.log(error);
			res.sendStatus(500);
		});
	} else
		res.sendStatus(400).send("Invalid channel");
}

initDatabase();
app.listen(PORT, serverUp);
app.get("/whatsapp", verifyEndpoint);
app.post("/whatsapp", receiveWhatsApp);

app.get("/messenger", verifyEndpoint);
app.post("/messenger", receiveMessenger);

app.get("/instagram", verifyEndpoint);
app.post("/instagram", receiveInstagram);

app.get("/unread_total", getTotalUnread);
app.get("/conversations", getConversations);
app.get("/messages", getMessages);
app.post("/message", sendMessage);
/*
app.put("/add_contact", addPhoneNumber); // TODO: add channel param
app.put("/mark_read", markRead); // TODO: use timestamp for messenger
*/
// TODO: Check timezones, decrease timestamp by 3 * 60 *60 seconds
