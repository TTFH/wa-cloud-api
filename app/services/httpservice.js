import { create } from "apisauce";

const api = create({
	baseURL: "http://localhost:3000/",
});

function getTotalUnread() {
	return api.get("unread_total");
}

function getConversations() {
	return api.get("conversations");
}

function getMessages(user_id) {
	return api.get("messages", { user_id });
}

function sendTextMessage(channel, user_id, text) {
	return api.post("message", { channel, user_id, text });
}

function addPhoneNumber(number) { // TODO: add channel, rename to contact
	return api.put("add_contact", { number });
}

function markAsRead(message_id) {
	return api.put("mark_read", { message_id });
}

export {
	getTotalUnread, getConversations, getMessages,
	sendTextMessage, addPhoneNumber, markAsRead,
};
