const fs = require("fs");
const http = require("axios").default;

const FB_BASE_URL = "https://graph.facebook.com/v14.0/";
const PHONE_NUMBER_ID = "";
const WHATSAPP_TOKEN = "";

function downloadMedia(media_id) {
	http.get(FB_BASE_URL + media_id, {
		headers: {
			Authorization: "Bearer " + WHATSAPP_TOKEN,
		},
	}).then(response => {
		const retrival_url = response.data.url;
		http.get(retrival_url, {
			responseType: "stream",
			headers: {
				Authorization: "Bearer " + WHATSAPP_TOKEN,
			},
		}).then(response => {
			const header = response.headers["content-disposition"];
			const filename = header.split("filename=")[1];
			const path = "media/" + media_id + "_" + filename;
			response.data.pipe(fs.createWriteStream(path)).on("finish", () => {
				console.log(filename + " downloaded.");
				database.media[media_id] = { path };
				database.update();
			});
		});
	});
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

		if (message.context) {
			console.log("Received reply-to message " + message.context.id);
			const reply_to = database.messages[message.context.id];
			if (reply_to) {
				database.messages[message_id].reply_to = {
					username: database.users[reply_to.from || reply_to.to].name,
					body: reply_to.caption || reply_to.template.name,
				};
			}
		}
		if (message.referral)
			console.log("Received referral: " + message.referral.body);

		if (message.type === "text") {
			const msg_body = message.text.body;
			//database.messages[message_id].text = { body: msg_body };
			database.messages[message_id].caption = msg_body;
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
			//database.messages[message_id].document = { caption, media_id: document_id };
			database.messages[message_id].document = { filename: caption, size: 0, uri: document_id };
		} else if (message.type === "sticker") {
			const sticker_id = message.sticker.id;
			downloadMedia(sticker_id);
			database.messages[message_id].sticker = { media_id: sticker_id };
		} else if (message.type === "button") {
			const button_text = message.button.text;
			//const payload = message.button.payload;
			//database.messages[message_id].button = { text: button_text };
			database.messages[message_id].caption = button_text;
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

function sendTextWA(phone_number, text_msg) {
	return new Promise((resolve, reject) => {
		http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
			{
				messaging_product: "whatsapp",
				to: phone_number,
				text: { body: text_msg },
			}, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + WHATSAPP_TOKEN,
			}
		}).then(response => {
			if (response.data.messages) {
				const message_id = response.data.messages[0].id;
				database.messages[message_id] = {
					to: phone_number,
					timestamp: Math.floor(Date.now() / 1000),
					status: "delivered",
					caption: text_msg,
				};
				database.update();
				resolve(message_id);
			}
		}).catch(error => {
			reject(error);
		});
	});
}

function sendTemplateWA(phone_number, template_name, vars) {
	return new Promise((resolve, reject) => {
		var req_body = {
			messaging_product: "whatsapp",
			to: phone_number,
			type: "template",
			template: {
				name: template_name,
				language: {
					policy: "deterministic",
					code: "en_US",
				},
				components: [{
					type: "body",
					parameters: [],
				}],
			}
		};
		vars.forEach(var1 => {
			req_body.template.components[0].parameters.push({
				type: "text",
				text: var1,
			});
		});

		http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
			req_body, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + WHATSAPP_TOKEN,
			}
		}).then(response => {
			if (response.data.messages) {
				const message_id = response.data.messages[0].id;
				database.messages[message_id] = {
					to: phone_number,
					timestamp: Math.floor(Date.now() / 1000),
					status: "delivered",
					template: { name: template_name, vars: vars },
				};
				database.update();
				resolve(message_id);
			}
		}).catch(error => {
			reject(error);
		});
	});
}

module.exports = { receiveWhatsApp, sendTextWA, sendTemplateWA };
