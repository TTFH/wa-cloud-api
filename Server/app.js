const path = require("path");
const express = require("express");
const body_parser = require("body-parser");
const app = express().use(body_parser.json());
const { updateDataBase } = require("./database.js");
const {
	downloadMedia, markAsRead, sendText, sendImage, sendAudio,
	sendVideo, sendDocument, sendSticker, sendLocation,
	sendContacts, sendTemplate, sendInteractive, sendTextReply,
} = require("./sendMessage.js");
const { sendImageRaw, sendAudioRaw, sendVideoRaw, sendStickerRaw, sendDocumentRaw } = require("./sendMediaMessage.js");

const PORT = 3000;
const VERIFY_TOKEN = "14980c8b8a96fd9e279796a61cf82c9c";

// node app.js
// ngrok http --region eu 3000
// https://???.eu.ngrok.io/webhook

function serverUp() {
	console.log("Webhook is listening!");
}

function verifyEndpoint(req, res) {
	if (req.query["hub.mode"] === "subscribe" &&
		req.query["hub.verify_token"] === VERIFY_TOKEN) {
		console.log("Webhook verified!");
		res.status(200).send(req.query["hub.challenge"]);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
}

function receiveNotification(req, res) {
	//console.log("Received Notification: " + JSON.stringify(req.body));
	const field = req.body.entry[0].changes[0].field;
	const value = req.body.entry[0].changes[0].value;

	if (field === "account_review_update")
		console.log("Your account has been " + value.decision);
	else if (field === "account_update")
		console.log("Accound " + value.phone_number + " is now a " + value.event);
	else if (field === "business_capability_update")
		console.log("Your business has available " + value.max_phone_numbers_per_business + " phone numbers with " + value.max_daily_conversation_per_phone + " conversations each");
	else if (field === "message_template_status_update")
		console.log("The template " + value.message_template_name + " has been " + value.event);
	else if (field === "phone_number_name_update")
		console.log("Your name " + value.requested_verified_name + " has been " + value.decision);
	else if (field === "phone_number_quality_update")
		console.log("Your phone number has been classified as " + value.current_limit);
	else if (field !== "messages")
		console.log("Unkown request: " + JSON.stringify(req.body));

	if (value.statuses) {
		const message_id = value.statuses[0].id;
		const status = value.statuses[0].status;

		if (database.messages[message_id])
			database.messages[message_id].status = status;
	} else if (value.messages) {
		const message = value.messages[0];
		const from = message.from;
		const username = value.contacts[0].profile.name;
		database.users[from] = { name: username };

		const message_id = message.id;
		const timestamp = message.timestamp;
		database.messages[message_id] = {
			from,
			timestamp,
			status: "delivered",
		};
		if (message.type !== "unsupported") {
			//markAsRead(message_id);
		}

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

	updateDataBase();
	if (res) res.sendStatus(200);
}

function hostFile(req, res) {
	const filename = req.params.filename;
	console.log("Sending file " + filename);
	const options = {
		root: path.join(__dirname, "media"),
		headers: {
			"Content-Disposition": "inline; filename=" + filename,
		},
	};
	res.sendFile(filename, options, error => {
		if (error) res.sendStatus(404);
	});
}

function getTotalUnread(req, res) {
	const total = Object.values(database.messages).filter(m => m.from && m.status !== "read").length;
	res.send(total.toString());
}

function getConversations(req, res) {
	var conversations = [];
	for (const user_id in database.users) {
		const username = database.users[user_id].name;
		const unread_count = Object.values(database.messages).filter(m => m.from === user_id && m.status !== "read").length;
		const last_message = Object.values(database.messages).filter(m => m.from === user_id || m.to === user_id).sort((a, b) => b.timestamp - a.timestamp)[0];
		conversations.push({ user_id, username, unread_count, last_message });
	}
	res.setHeader("Content-Type", "application/json");
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
	res.send(messages);
}

function sendMessage(req, res) {
	const phone_number = req.body.user_id;
	const message_text = req.body.text;
	sendText(phone_number, message_text).then(message_id => {
		res.send(message_id);
	}).catch(error => {
		res.sendStatus(error.response.status);
	});
}

function addPhoneNumber(req, res) {
	const phone_number = req.body.number;
	const name = "Numero Desconocido";
	database.users[phone_number] = { name };
	updateDataBase();
	res.send(name);
}

function markRead(req, res) {
	const message_id = req.body.message_id;
	if (database.messages[message_id].status !== "read") {
		markAsRead(message_id);
		database.messages[message_id].status = "read";
		updateDataBase();
	}
	res.sendStatus(200);
}

const DEBUG = false;
if (!DEBUG) {
	app.listen(PORT, serverUp);
	app.get("/webhook", verifyEndpoint);
	app.post("/webhook", receiveNotification);
	app.get("/media/:filename", hostFile);

	app.get("/unread_total", getTotalUnread);
	app.get("/conversations", getConversations);
	app.get("/messages", getMessages);
	app.post("/message", sendMessage);

	app.put("/add_user", addPhoneNumber);
	app.put("/markread", markRead);
} else {
	/*const test_json = {};
	req = { body: test_json };
	receiveNotification(req, null);*/

	const phone_number = "59899999999";
	const contacts_data = [{
		addresses: [{
			street: "",
			city: "",
			state: "",
			zip: "",
			country: "",
			country_code: "",
			type: "HOME",
		}],
		birthday: "",
		emails: [{
			email: "",
			type: "HOME",
		}],
		name: {
			formatted_name: "",
			prefix: "",
			first_name: "",
			middle_name: "",
			last_name: "",
			suffix: "",
		},
		org: {
			company: "",
			department: "",
			title: "",
		},
		phones: [{
			phone: "",
			type: "CELL",
		}],
		urls: [{
			url: "",
			type: "WORK",
		}]
	}];

	//sendText(phone_number, "Hello world!");
	//sendImageRaw(phone_number, "Coo coo roo coo!", "./media/rooster.jpg");
	//sendContacts(phone_number, contacts_data);
}
