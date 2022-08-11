const http = require("axios").default;

const FB_BASE_URL = "https://graph.facebook.com/v14.0/";
const MESSENGER_TOKEN = "";

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
			return;
		}

		http.get(FB_BASE_URL + user_id + "?access_token=" + MESSENGER_TOKEN, {
		}).then(response => {
			if (response.data.id) {
				const username = response.data.first_name + " " + response.data.last_name;
				database.users[user_id] = { channel: "messenger", name: username, profile_pic: response.data.profile_pic };
				database.update(); // Needed cause async
			}
		});

		const message_id = entry.messaging[0].message.mid;
		const timestamp = entry.messaging[0].timestamp; // TODO: Seconds or ms?, timezone?
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

function sendTextFB(user_id, text_msg) {
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

module.exports = { receiveMessenger, sendTextFB };
