//import { Expo } from "expo-server-sdk";
const Expo = require("expo-server-sdk").default;

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
const expo = new Expo();

const somePushTokens = ["ExponentPushToken[aaVg3KG8UvqAnRZHXr_Jg6]"];

// Create the messages that you want to send to clients
let messages = [];
for (const pushToken of somePushTokens) {
	// Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

	// Check that all your push tokens appear to be valid Expo push tokens
	if (!Expo.isExpoPushToken(pushToken)) {
		console.error(`Push token ${pushToken} is not a valid Expo push token`);
		continue;
	}

	// Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
	messages.push({
		to: pushToken,
		subtitle: "Nuevo mensaje Sailbot WOW",
		title: "💬 Mensaje de Juan Perez",
		body: "¿Cuándo me van a responder?,\nquiero cancelar el \"servicio\".",
		data: {
			user_id: "2",
			username: "Juan Perez",
			channel: "whatsapp",
			unread_count: 1,
			message: {
				message_id: "123",
				incoming: true,
				status: "received",
				timestamp: 1660800000,
				caption: "¿Cuándo me van a responder?,\nquiero cancelar el \"servicio\".",
			},
		},
	});
}

// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).
const chunks = expo.chunkPushNotifications(messages);
let tickets = [];
(async () => {
	// Send the chunks to the Expo push notification service. There are
	// different strategies you could use. A simple one is to send one chunk at a
	// time, which nicely spreads the load out over time:
	for (const chunk of chunks) {
		try {
			const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			console.log(ticketChunk);
			tickets.push(...ticketChunk);
			// NOTE: If a ticket contains an error code in ticket.details.error, you
			// must handle it appropriately. The error codes are listed in the Expo
			// documentation:
			// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
		} catch (error) {
			console.error(error);
		}
	}
})();

console.log("Waiting...");
(async () => { await new Promise(resolve => setTimeout(resolve, 30000)); });
console.log("Done!");

// Later, after the Expo push notification service has delivered the
// notifications to Apple or Google (usually quickly, but allow the the service
// up to 30 minutes when under load), a "receipt" for each notification is
// created. The receipts will be available for at least a day; stale receipts
// are deleted.
//
// The ID of each receipt is sent back in the response "ticket" for each
// notification. In summary, sending a notification produces a ticket, which
// contains a receipt ID you later use to get the receipt.
//
// The receipts may contain error codes to which you must respond. In
// particular, Apple or Google may block apps that continue to send
// notifications to devices that have blocked notifications or have uninstalled
// your app. Expo does not control this policy and sends back the feedback from
// Apple and Google so you can handle it appropriately.
let receiptIds = [];
for (const ticket of tickets) {
	// NOTE: Not all tickets have IDs; for example, tickets for notifications
	// that could not be enqueued will have error information and no receipt ID.
	if (ticket.id) {
		receiptIds.push(ticket.id);
	}
}

const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
(async () => {
	// Like sending notifications, there are different strategies you could use
	// to retrieve batches of receipts from the Expo service.
	for (const chunk of receiptIdChunks) {
		try {
			const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
			console.log(receipts);

			// The receipts specify whether Apple or Google successfully received the
			// notification and information about an error, if one occurred.
			for (const receiptId in receipts) {
				const { status, message, details } = receipts[receiptId];
				if (status === "ok") {
					continue;
				} else if (status === "error") {
					console.error(
						`There was an error sending a notification: ${message}`
					);
					if (details && details.error) {
						// The error codes are listed in the Expo documentation:
						// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
						// You must handle the errors appropriately.
						console.error(`The error code is ${details.error}`);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
})();
