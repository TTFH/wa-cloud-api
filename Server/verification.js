const VERIFY_TOKEN = "14980c8b8a96fd9e279796a61cf82c9c";

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

module.exports = { serverUp, verifyEndpoint };
