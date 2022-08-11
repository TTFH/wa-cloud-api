const fs = require("fs");
const http = require("axios").default;
const { updateDataBase } = require("./database.js");

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

function sendImageId(phone_number, caption, media_id, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "image",
			image: { caption, id: media_id },
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
				image: { caption, filename },
			};
			updateDataBase();
		}
	});
}

function sendImageRaw(phone_number, caption, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/media",
		{
			messaging_product: "whatsapp",
			type: "image/jpeg",
			file: fs.createReadStream(filename),
		}, {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	}).then(response => {
		const media_id = response.data.id;
		sendImageId(phone_number, caption, media_id, filename);
	});
}

function sendAudioId(phone_number, media_id, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "audio",
			audio: { id: media_id },
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
				audio: { filename },
			};
			updateDataBase();
		}
	});
}

function sendAudioRaw(phone_number, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/media",
		{
			messaging_product: "whatsapp",
			type: "audio/mpeg",
			file: fs.createReadStream(filename),
		}, {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	}).then(response => {
		const media_id = response.data.id;
		sendAudioId(phone_number, media_id, filename);
	});
}

function sendVideoId(phone_number, caption, media_id, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "video",
			video: { caption, id: media_id },
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
				video: { caption, filename },
			};
			updateDataBase();
		}
	});
}

function sendVideoRaw(phone_number, caption, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/media",
		{
			messaging_product: "whatsapp",
			type: "video/mp4",
			file: fs.createReadStream(filename),
		}, {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	}).then(response => {
		const media_id = response.data.id;
		sendVideoId(phone_number, caption, media_id, filename);
	});
}

function sendStickerId(phone_number, media_id, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "sticker",
			sticker: { id: media_id },
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
				sticker: { filename },
			};
			updateDataBase();
		}
	});
}

function sendStickerRaw(phone_number, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/media",
		{
			messaging_product: "whatsapp",
			type: "image/webp",
			file: fs.createReadStream(filename),
		}, {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	}).then(response => {
		const media_id = response.data.id;
		sendStickerId(phone_number, media_id, filename);
	});
}

function sendDocumentId(phone_number, caption, media_id, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
		{
			messaging_product: "whatsapp",
			to: phone_number,
			type: "document",
			document: { caption, id: media_id },
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
				document: { filename },
			};
			updateDataBase();
		}
	});
}

function sendDocumentRaw(phone_number, caption, filename) {
	http.post(FB_BASE_URL + PHONE_NUMBER_ID + "/media",
		{
			messaging_product: "whatsapp",
			type: "application/pdf",
			file: fs.createReadStream(filename),
		}, {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	}).then(response => {
		const media_id = response.data.id;
		sendDocumentId(phone_number, caption, media_id, filename);
	});
}

module.exports = { sendImageRaw, sendAudioRaw, sendVideoRaw, sendStickerRaw, sendDocumentRaw };
