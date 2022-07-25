const fs = require("fs");
const http = require("axios").default;
const { updateDataBase } = require("./database.js");

global.PHONE_NUMBER_ID = "";
global.FB_BASE_URL = "https://graph.facebook.com/v14.0/";
global.WHATSAPP_TOKEN = "";

http.interceptors.request.use(config => {
	config.headers.Authorization = "Bearer " + WHATSAPP_TOKEN;
	return config;
}, error => {
	return Promise.reject(error);
});

http.interceptors.response.use(response => {
	return response;
}, error => {
	console.log("Response Error: " + error.message);
	console.log(error.response.data);
	return Promise.reject(error);
});

function downloadMedia(media_id) {
	http.get(FB_BASE_URL + media_id, {
	}).then(response => {
		const retrival_url = response.data.url;
		http.get(retrival_url, {
			responseType: "stream",
		}).then(response => {
			const filename = response.headers["Content-Disposition"].split("filename=")[1];
			const path = media_id + "_" + filename;
			response.data.pipe(fs.createWriteStream(path)).on("finish", () => {
				console.log(filename + " downloaded.");
				database.media[media_id] = { path };
				updateDataBase();
			});
		});
	});
}

function markAsRead(message_id) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			status: "read",
			message_id,
		}, {
		headers: {
			"Content-Type": "application/json",
		},
	});
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
				updateDataBase();
				resolve(message_id);
			}
		}).catch(error => {
			reject(error);
		});
	});
}

function sendImage(phone_number, caption, image_url) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "image",
			image: { caption, link: image_url },
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
				image: { caption, link: image_url },
			};
			updateDataBase();
		}
	});
}

function sendAudio(phone_number, audio_url) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "audio",
			audio: { link: audio_url },
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
				audio: { link: audio_url },
			};
			updateDataBase();
		}
	});
}

function sendVideo(phone_number, caption, video_url) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "video",
			video: { caption, link: video_url },
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
				video: { caption, link: video_url },
			};
			updateDataBase();
		}
	});
}

function sendDocument(phone_number, filename, document_url) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "document",
			document: { caption: filename, link: document_url },
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
				document: { caption: filename, link: document_url },
			};
			updateDataBase();
		}
	});
}

function sendSticker(phone_number, sticker_url) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "sticker",
			sticker: { link: sticker_url },
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
				sticker: { link: sticker_url },
			};
			updateDataBase();
		}
	});
}

function sendLocation(phone_number, longitude, latitude, name, address) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "location",
			location: {
				longitude,
				latitude,
				name,
				address,
			},
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
				location: {
					longitude,
					latitude,
					name,
					address,
				},
			};
			updateDataBase();
		}
	});
}

function sendContacts(phone_number, contacts) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "contacts",
			contacts,
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
				contacts: { name: contacts[0].name.formatted_name },
			};
			updateDataBase();
		}
	});
}

function sendTemplate(phone_number, template_name, var1, payload) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
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
					parameters: [{
						type: "text",
						text: var1,
					}],
				}, {
					type: "button",
					sub_type: "quick_reply",
					index: 0,
					parameters: [{
						type: "payload",
						payload,
					}],
				}],
			}
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
				template: { name: "template_name_unk" },
			};
			updateDataBase();
		}
	});
}

function sendInteractive(phone_number, title, subtitle, footer, buttonyes, buttonno) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "interactive",
			interactive: {
				type: "button",
				header: {
					type: "text",
					text: title,
				},
				body: { text: subtitle },
				footer: { text: footer },
				action: {
					buttons: [{
						type: "reply",
						reply: {
							id: "yes",
							title: buttonyes,
						},
					}, {
						type: "reply",
						reply: {
							id: "no",
							title: buttonno,
						},
					}],
				},
			}
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
				interactive: { name: "interactive_unk" },
			};
			updateDataBase();
		}
	});
}

function sendTextReply(phone_number, text_msg, message_id) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			text: { body: text_msg },
			context: { message_id },
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
				reply_to: message_id,
				text: { body: text_msg },
			};
			updateDataBase();
		}
	});
}

module.exports = {
	downloadMedia, markAsRead, sendText, sendImage, sendAudio,
	sendVideo, sendDocument, sendSticker, sendLocation,
	sendContacts, sendTemplate, sendInteractive, sendTextReply,
};
