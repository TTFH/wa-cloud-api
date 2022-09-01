const express = require("express");
const http = require("axios").default;
const body_parser = require("body-parser");
const app = express().use(body_parser.json());

const { initDatabase } = require("./database.js");
const { serverUp, verifyEndpoint } = require("./verification.js");
const { receiveWhatsApp, sendTextWA, sendTemplateWA } = require("./whatsapp.js");
const { receiveMessenger, sendTextFB } = require("./messenger.js");
const { receiveInstagram, sendTextIG } = require("./instagram.js");

const PORT = 3000;
const FB_BASE_URL = "https://graph.facebook.com/v14.0/";

http.interceptors.response.use(response => {
	return response;
}, error => {
	console.log("Response Error: " + error.message);
	console.log(error.response.data);
	return Promise.reject(error);
});

function getConversations(req, res) {
	var conversations = [];
	for (const user_id in database.users) {
		const user = database.users[user_id];
		const unread_count = Object.values(database.messages).filter(m => m.from === user_id && m.status !== "read").length;
		var message = Object.values(database.messages).filter(m => m.from === user_id || m.to === user_id).sort((a, b) => b.timestamp - a.timestamp)[0];
		message.incoming = !message.to;
		conversations.push({ user_id, username: user.name, channel: user.channel, profile_pic: user.profile_pic, unread_count, message });
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
		m.incoming = !m.to;
		if (m.from === user_id || m.to === user_id)
			messages.push(m);
	}
	messages.sort((a, b) => a.timestamp - b.timestamp);
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(messages);
}

function sendMessage(req, res) {
	const channel = req.body.channel;
	const user_id = req.body.user_id;
	const message_text = req.body.text;
	console.log("Sending message to " + channel + ": " + message_text);
	res.setHeader("Access-Control-Allow-Origin", "*");

	if (channel === "whatsapp") {
		sendTextWA(user_id, message_text).then(message_id => {
			res.send(message_id);
		}).catch(error => {
			res.sendStatus(error.response.status);
		});
	} else if (channel === "messenger") {
		sendTextFB(user_id, message_text).then(message_id => {
			res.send(message_id);
		}).catch(error => {
			res.sendStatus(error.response.status);
		});
	} else if (channel === "instagram") {
		sendTextIG(user_id, message_text).then(message_id => {
			res.send(message_id);
		}).catch(error => {
			res.sendStatus(error.response.status);
		});
	} else
		res.sendStatus(400).send("Invalid channel");
}

function addIgAccount(req, res) {
	const user_token = req.body.user_token;
	console.log("1 " + user_token);
	res.setHeader("Access-Control-Allow-Origin", "*");
	try {
		http.get(FB_BASE_URL + "me/accounts" + "?access_token=" + user_token, {
		}).then(response => {
			const page_token = response.data.data[0].access_token;
			console.log("2 " + page_token);
			http.get(FB_BASE_URL + "me?fields=instagram_business_account" + "&access_token=" + page_token, {
			}).then(response => {
				const ig_id = response.data.instagram_business_account.id;
				console.log("3 " + ig_id);
				http.get(FB_BASE_URL + ig_id + "?fields=username" + "&access_token=" + page_token, {
				}).then(response => {
					const ig_username = response.data.username;
					console.log("4 " + ig_username);
					database.instagram = { id: ig_id, name: ig_username, token: page_token };
					database.update();
					res.sendStatus(200);
				});
			});
		});
	} catch (error) {
		res.sendStatus(error.response.status);
	}
}

function getIgUsername(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (database.instagram) {
		const ig_username = database.instagram.name;
		return res.send(ig_username);
	}
	res.send("Not logged in");
}

function addPhoneNumber(req, res) {
	const phone_number = req.body.number;
	console.log("Numero: " + phone_number);
	const name = "Numero Desconocido";
	database.users[phone_number] = { channel: "whatsapp", name };
	database.update();
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(name);
}

function sendTemplate(req, res) {
	const phone_number = req.body.phone_number;
	const template_name = req.body.template_name;
	const vars = req.body.vars;
	res.setHeader("Access-Control-Allow-Origin", "*");
	sendTemplateWA(phone_number, template_name, vars).then(message_id => {
		res.send(message_id);
	}).catch(error => {
		res.sendStatus(error.response.status);
	});
}

initDatabase();
app.listen(PORT, serverUp);
app.get("/whatsapp", verifyEndpoint);
app.post("/whatsapp", receiveWhatsApp);
/*
app.get("/messenger", verifyEndpoint);
app.post("/messenger", receiveMessenger);

app.get("/instagram", verifyEndpoint);
app.post("/instagram", receiveInstagram);
*/
app.get("/conversations", getConversations);
app.get("/messages", getMessages);
app.post("/message", sendMessage);

app.post("/template", sendTemplate);
/*
app.get("/ig_username", getIgUsername);
app.put("/add_ig_account", addIgAccount);
*/
app.put("/add_contact", addPhoneNumber); // TODO: add channel param
/*
app.get("/unread_total", getTotalUnread); // TODO: whatsapp only
app.put("/mark_read", markRead); // TODO: use timestamp for messenger
// TODO: Check timezones, decrease timestamp by 3 * 60 *60 seconds
*/
