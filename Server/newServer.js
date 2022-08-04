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
		database.users[from] = { name: username };

		const message_id = message.id;
		const timestamp = message.timestamp;
		database.messages[message_id] = {
			from,
			timestamp,
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
		http.get(FB_BASE_URL + user_id + "?access_token=" + MESSENGER_TOKEN, {
		}).then(response => {
			if (response.data.id) {
				const username = response.data.first_name + " " + response.data.last_name;
				database.users[user_id] = { name: username };
				database.update();
			}
		});

		const message_id = entry.messaging[0].message.mid;
		const timestamp = entry.messaging[0].timestamp;
		database.messages[message_id] = {
			from: user_id,
			timestamp,
			status: "delivered",
		};

		database.messages[message_id].text = { body: entry.messaging[0].message.text };
	});
	database.update();
	res.sendStatus(200);
}

initDatabase();
app.listen(PORT, serverUp);
app.get("/whatsapp", verifyEndpoint);
app.post("/whatsapp", receiveWhatsApp);

app.get("/messenger", verifyEndpoint);
app.post("/messenger", receiveMessenger);
