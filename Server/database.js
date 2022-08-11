const fs = require("fs");

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

module.exports = { initDatabase };
